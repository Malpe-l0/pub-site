import { db } from './db'
import { salvaFotoBuffer, eliminaFoto } from './upload'
import type { StatoInstagram } from './tipi'

// Sincronizzazione della galleria con i post Instagram del pub.
// Strada "fai-da-te": Instagram Graph API (la vecchia Basic Display è stata
// chiusa da Meta a fine 2024). Richiede un account IG Business/Creator, un'app
// Meta e un token a lunga durata, salvato in DB (così il rinnovo può aggiornarlo).
//
// Le foto vengono SCARICATE e ricompresse in locale: gli URL del CDN di
// Instagram scadono dopo poche ore, quindi non si possono linkare direttamente.

const VERSIONE_API = 'v21.0' // verificare la versione corrente al momento della configurazione
const NUMERO_FOTO = 9

type MediaIG = {
  id: string
  media_type: string
  media_url?: string
  permalink?: string
  caption?: string
  timestamp?: string
}

type RispostaMedia = { data?: MediaIG[]; error?: { message?: string } }

type RigaStato = {
  user_id: string
  access_token: string
  token_scade_il: string | null
  ultima_sync: string | null
  ultimo_esito: string
}

function leggiStato(): RigaStato {
  return db
    .prepare(
      'SELECT user_id, access_token, token_scade_il, ultima_sync, ultimo_esito FROM instagram_stato WHERE id = 1'
    )
    .get() as RigaStato
}

/** Stato per il pannello admin (senza esporre il token). */
export function getStatoInstagram(): StatoInstagram {
  const s = leggiStato()
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM foto_instagram').get() as { n: number }
  return {
    configurato: Boolean(s.user_id && s.access_token),
    userId: s.user_id,
    tokenScadeIl: s.token_scade_il,
    ultimaSync: s.ultima_sync,
    ultimoEsito: s.ultimo_esito,
    numeroFoto: n,
  }
}

/** Salva ID account e token dal pannello. Token vuoto = lascia quello esistente. */
export function salvaConfigInstagram(userId: string, accessToken: string): void {
  if (accessToken) {
    // I token a lunga durata vivono ~60 giorni; data indicativa, va rinnovata prima.
    const scade = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString()
    db.prepare(
      'UPDATE instagram_stato SET user_id = ?, access_token = ?, token_scade_il = ? WHERE id = 1'
    ).run(userId, accessToken, scade)
  } else {
    db.prepare('UPDATE instagram_stato SET user_id = ? WHERE id = 1').run(userId)
  }
}

function registraEsito(ok: boolean, messaggio: string): { ok: boolean; messaggio: string } {
  db.prepare('UPDATE instagram_stato SET ultima_sync = ?, ultimo_esito = ? WHERE id = 1').run(
    new Date().toISOString(),
    messaggio
  )
  return { ok, messaggio }
}

/**
 * Scarica gli ultimi post immagine e rimpiazza la cache locale (tabella
 * foto_instagram + file in data/uploads). Difensiva: il singolo errore non
 * rompe la galleria, e senza configurazione è un no-op silenzioso.
 */
export async function sincronizzaInstagram(): Promise<{ ok: boolean; messaggio: string }> {
  const s = leggiStato()
  if (!s.user_id || !s.access_token) return registraEsito(false, 'Instagram non collegato')

  let media: MediaIG[]
  try {
    const url =
      `https://graph.instagram.com/${VERSIONE_API}/${s.user_id}/media` +
      `?fields=id,media_type,media_url,permalink,caption,timestamp&limit=25&access_token=${s.access_token}`
    const res = await fetch(url, { cache: 'no-store' })
    const dati = (await res.json()) as RispostaMedia
    if (!res.ok || dati.error) {
      return registraEsito(false, `Errore Instagram: ${dati.error?.message ?? res.status}`)
    }
    media = dati.data ?? []
  } catch (errore) {
    return registraEsito(false, `Connessione a Instagram fallita: ${(errore as Error).message}`)
  }

  const recenti = media
    .filter((m) => (m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM') && m.media_url)
    .slice(0, NUMERO_FOTO)

  // File già in cache: non li riscarichiamo.
  const esistenti = new Map(
    (
      db.prepare('SELECT ig_id, file FROM foto_instagram').all() as { ig_id: string; file: string }[]
    ).map((r) => [r.ig_id, r.file] as const)
  )

  const nuove: {
    igId: string
    file: string
    permalink: string
    didascalia: string
    scattataIl: string
  }[] = []
  for (const m of recenti) {
    let file = esistenti.get(m.id)
    if (!file) {
      try {
        const img = await fetch(m.media_url!, { cache: 'no-store' })
        file = await salvaFotoBuffer(Buffer.from(await img.arrayBuffer()), 1600)
      } catch {
        continue // salta la singola foto non scaricabile, senza rompere la sync
      }
    }
    nuove.push({
      igId: m.id,
      file,
      permalink: m.permalink ?? '',
      didascalia: (m.caption ?? '').slice(0, 280),
      scattataIl: m.timestamp ?? '',
    })
  }

  // Elimina dal disco le foto non più tra le ultime, poi riscrive la cache.
  const idsNuovi = new Set(nuove.map((n) => n.igId))
  for (const [igId, file] of esistenti) {
    if (!idsNuovi.has(igId)) await eliminaFoto(file)
  }

  const scrivi = db.transaction(() => {
    db.prepare('DELETE FROM foto_instagram').run()
    const ins = db.prepare(
      'INSERT INTO foto_instagram (ig_id, file, permalink, didascalia, scattata_il, ordine) VALUES (?, ?, ?, ?, ?, ?)'
    )
    nuove.forEach((n, i) => ins.run(n.igId, n.file, n.permalink, n.didascalia, n.scattataIl, i))
  })
  scrivi()

  return registraEsito(true, `Sincronizzate ${nuove.length} foto`)
}

/**
 * Rinnova il token a lunga durata (vanno rinnovati entro ~60 giorni).
 * Da richiamare da un job schedulato una volta scelto l'hosting (cron su VPS,
 * Vercel/Cloudflare Cron). Non ancora agganciato a uno scheduler.
 * ponytail: nessuno scheduler finché l'host non è deciso; per ora rinnovo manuale.
 */
export async function rinnovaTokenInstagram(): Promise<{ ok: boolean; messaggio: string }> {
  const s = leggiStato()
  if (!s.access_token) return { ok: false, messaggio: 'non configurato' }
  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${s.access_token}`
    const res = await fetch(url, { cache: 'no-store' })
    const dati = (await res.json()) as {
      access_token?: string
      expires_in?: number
      error?: { message?: string }
    }
    if (!res.ok || dati.error || !dati.access_token) {
      return { ok: false, messaggio: dati.error?.message ?? `HTTP ${res.status}` }
    }
    const scade = new Date(Date.now() + (dati.expires_in ?? 5184000) * 1000).toISOString()
    db.prepare('UPDATE instagram_stato SET access_token = ?, token_scade_il = ? WHERE id = 1').run(
      dati.access_token,
      scade
    )
    return { ok: true, messaggio: 'Token rinnovato' }
  } catch (errore) {
    return { ok: false, messaggio: (errore as Error).message }
  }
}
