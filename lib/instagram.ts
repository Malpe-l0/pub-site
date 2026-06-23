import { db } from './db'
import type { InstagramConfig, InstagramPost } from './tipi'

// Collegamento al profilo Instagram tramite la Graph API (account Business o
// Creator). Il token a lunga scadenza dura ~60 giorni e si rinnova da solo
// prima di scadere; i post vengono messi in cache nel database.
//
// Attenzione: gli URL di `media_url`/`thumbnail_url` restituiti da Instagram
// sono firmati e scadono dopo poche ore. Per questo la cache va rinfrescata
// spesso (vedi `avviaAggiornamentoSeStantio`), non una volta sola.

const HOST = 'https://graph.instagram.com'
const CAMPI = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username'
const LIMITE_FETCH = 12
const TIMEOUT_MS = 10_000
const INTERVALLO_AGGIORNAMENTO_MS = 30 * 60 * 1000 // rinfresca la cache ogni 30 min
const DURATA_TOKEN_MS = 60 * 24 * 60 * 60 * 1000 // i token a lunga scadenza durano ~60 giorni
const SOGLIA_RINNOVO_MS = 10 * 24 * 60 * 60 * 1000 // rinnova entro 10 giorni dalla scadenza

type RigaConfig = {
  token: string
  token_scadenza: string | null
  attivo: number
  username: string
  aggiornato_il: string | null
  ultimo_errore: string
}

export function getConfigInstagram(): InstagramConfig {
  const r = db.prepare('SELECT * FROM instagram WHERE id = 1').get() as RigaConfig
  return {
    token: r.token,
    tokenScadenza: r.token_scadenza,
    attivo: r.attivo === 1,
    username: r.username,
    aggiornatoIl: r.aggiornato_il,
    ultimoErrore: r.ultimo_errore,
  }
}

type RigaPost = {
  id: string
  permalink: string
  media_url: string
  thumbnail_url: string
  caption: string
  media_type: string
  timestamp: string
}

export function getPostInstagram(limite = 12): InstagramPost[] {
  const righe = db
    .prepare('SELECT * FROM instagram_post ORDER BY ordine LIMIT ?')
    .all(limite) as RigaPost[]
  return righe.map((r) => ({
    id: r.id,
    permalink: r.permalink,
    mediaUrl: r.media_url,
    thumbnailUrl: r.thumbnail_url,
    caption: r.caption,
    mediaType: r.media_type,
    timestamp: r.timestamp,
  }))
}

/**
 * Salva token e stato dal pannello. Un token vuoto lascia invariato quello
 * esistente (così nel form non serve riscriverlo). Cambiare token azzera la
 * cache: i vecchi post non valgono più.
 */
export function salvaConfigInstagram(token: string, attivo: boolean) {
  const esistente = getConfigInstagram()
  const cambiato = token !== '' && token !== esistente.token
  const tokenFinale = token || esistente.token
  const scadenza = cambiato
    ? new Date(Date.now() + DURATA_TOKEN_MS).toISOString()
    : esistente.tokenScadenza

  db.prepare(
    'UPDATE instagram SET token = ?, attivo = ?, token_scadenza = ?, ultimo_errore = ? WHERE id = 1'
  ).run(tokenFinale, attivo ? 1 : 0, scadenza, cambiato ? '' : esistente.ultimoErrore)

  if (cambiato) db.prepare('DELETE FROM instagram_post').run()
}

type RispostaErrore = { error?: { message?: string } }

async function chiamata<T>(url: string): Promise<T> {
  const ctrl = new AbortController()
  const stop = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const risposta = await fetch(url, { cache: 'no-store', signal: ctrl.signal })
    const corpo = (await risposta.json().catch(() => null)) as (T & RispostaErrore) | null
    if (!risposta.ok || !corpo) {
      throw new Error(corpo?.error?.message || `Instagram ha risposto HTTP ${risposta.status}`)
    }
    return corpo
  } finally {
    clearTimeout(stop)
  }
}

/** Rinnova il token se vicino alla scadenza; restituisce quello da usare. */
async function forseRinnovaToken(config: InstagramConfig): Promise<string> {
  if (!config.tokenScadenza) return config.token
  const restante = new Date(config.tokenScadenza).getTime() - Date.now()
  if (restante > SOGLIA_RINNOVO_MS) return config.token

  const url = `${HOST}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(
    config.token
  )}`
  const dati = await chiamata<{ access_token: string; expires_in?: number }>(url)
  const durataMs = (Number(dati.expires_in) || DURATA_TOKEN_MS / 1000) * 1000
  const scadenza = new Date(Date.now() + durataMs).toISOString()
  db.prepare('UPDATE instagram SET token = ?, token_scadenza = ? WHERE id = 1').run(
    dati.access_token,
    scadenza
  )
  return dati.access_token
}

type MediaApi = {
  id: string
  caption?: string
  media_type?: string
  media_url?: string
  permalink?: string
  thumbnail_url?: string
  timestamp?: string
  username?: string
}

/**
 * Scarica gli ultimi post dal profilo e rimpiazza la cache. Registra esito ed
 * eventuale errore nella riga di configurazione, da mostrare nel pannello.
 */
export async function sincronizzaInstagram(): Promise<{ ok: boolean; messaggio: string }> {
  const config = getConfigInstagram()
  if (!config.token) return { ok: false, messaggio: 'Manca il token di accesso.' }

  try {
    const token = await forseRinnovaToken(config)
    const url = `${HOST}/me/media?fields=${CAMPI}&limit=${LIMITE_FETCH}&access_token=${encodeURIComponent(
      token
    )}`
    const dati = await chiamata<{ data?: MediaApi[] }>(url)
    const elementi = dati.data ?? []

    const inserisci = db.prepare(
      `INSERT OR REPLACE INTO instagram_post
       (id, permalink, media_url, thumbnail_url, caption, media_type, timestamp, ordine)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    const sostituisci = db.transaction((lista: MediaApi[]) => {
      db.prepare('DELETE FROM instagram_post').run()
      lista.forEach((p, i) =>
        inserisci.run(
          String(p.id),
          p.permalink ?? '',
          p.media_url ?? '',
          p.thumbnail_url ?? '',
          p.caption ?? '',
          p.media_type ?? '',
          p.timestamp ?? '',
          i
        )
      )
    })
    sostituisci(elementi)

    const username = elementi[0]?.username ?? config.username
    db.prepare(
      `UPDATE instagram SET aggiornato_il = datetime('now'), ultimo_errore = '', username = ? WHERE id = 1`
    ).run(username)
    return { ok: true, messaggio: `Aggiornati ${elementi.length} post.` }
  } catch (errore) {
    const messaggio = errore instanceof Error ? errore.message : 'Errore sconosciuto'
    db.prepare('UPDATE instagram SET ultimo_errore = ? WHERE id = 1').run(messaggio)
    return { ok: false, messaggio }
  }
}

// Guardie in memoria: niente raffiche di chiamate né più sync in parallelo.
let inCorso = false
let ultimoTentativo = 0

/**
 * Aggiornamento "alla buona" innescato dalle visite: se la cache è vecchia e
 * nessun aggiornamento è in corso, ne lancia uno in sottofondo senza bloccare
 * la pagina. Pensato per un sito sempre acceso su un VPS.
 */
export function avviaAggiornamentoSeStantio(): void {
  const config = getConfigInstagram()
  if (!config.attivo || !config.token) return

  const adesso = Date.now()
  if (inCorso || adesso - ultimoTentativo < INTERVALLO_AGGIORNAMENTO_MS) return

  const eta = config.aggiornatoIl
    ? adesso - new Date(config.aggiornatoIl + 'Z').getTime()
    : Infinity
  if (eta < INTERVALLO_AGGIORNAMENTO_MS) return

  inCorso = true
  ultimoTentativo = adesso
  void sincronizzaInstagram().finally(() => {
    inCorso = false
  })
}
