import crypto from 'node:crypto'
import { chiave, cifraSegreto, decifraSegreto } from './secrets.ts'
import { MAX_FILE_BYTES } from './media.ts'
import { db, DATA_DIR } from './db.ts'
import { salvaFotoBuffer, eliminaFoto } from './upload.ts'

const ORA = 3600000
const GIORNO = 24 * ORA
export type FonteGalleria = 'automatica' | 'manuale' | 'instagram' | 'mista'
type RigaStato = {
  user_id: string; access_token: string; username: string; token_scade_il: string | null
  ultima_sync: string | null; ultimo_tentativo: string | null; ultimo_rinnovo: string | null
  ultimo_esito: string; verificato_il: string | null; errore_codice: string; revisione: number
}
type MediaIG = { id: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink?: string; caption?: string; timestamp?: string }
type Esito = { ok: boolean; messaggio: string }
type Profilo = { id: string; username: string }
export class ErroreInstagram extends Error {
  codice: string
  constructor(codice: string, message: string) { super(message); this.codice=codice }
}
export function versioneApi() {
  const version = process.env.INSTAGRAM_API_VERSION || ''
  if (!/^v\d{2,3}\.0$/.test(version)) throw new ErroreInstagram('configurazione', 'La versione API Instagram deve essere configurata da chi gestisce il sito.')
  return version
}
export function configurazioneOAuth() {
  const clientId = process.env.INSTAGRAM_APP_ID || ''
  const secret = process.env.INSTAGRAM_APP_SECRET || ''
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || ''
  try {
    versioneApi()
    const u = new URL(redirectUri)
    const locale = process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol === 'http:'
    if (!/^\d{5,40}$/.test(clientId) || !secret || !(u.protocol === 'https:' || locale) || u.username || u.password || u.search || u.hash || u.pathname !== '/admin/instagram/callback') throw new Error()
    return { pronta: true as const, clientId, secret, redirectUri }
  } catch { return { pronta: false as const, messaggio: 'Il collegamento guidato va configurato dal gestore del sito. Le foto caricate a mano sono già utilizzabili.' } }
}
function leggiStato(): RigaStato {
  const row = db.prepare('SELECT * FROM instagram_stato WHERE id=1').get() as RigaStato
  if (row.access_token) {
    const key = chiave(DATA_DIR, 'app')
    if (!row.access_token.startsWith('enc:v1:')) db.prepare('UPDATE instagram_stato SET access_token=? WHERE id=1 AND access_token=?').run(cifraSegreto(row.access_token, key), row.access_token)
    else row.access_token = decifraSegreto(row.access_token, key)
  }
  return row
}
export function getConfigGalleria() {
  const row = db.prepare('SELECT fonte,includi_reel FROM galleria_config WHERE id=1').get() as { fonte: FonteGalleria; includi_reel: number }
  return { fonte: row.fonte, includiReel: Boolean(row.includi_reel) }
}
export function salvaConfigGalleria(fonte: string, reel: boolean) {
  if (!['automatica', 'manuale', 'instagram', 'mista'].includes(fonte)) throw new Error('Scegli una fonte valida per la galleria.')
  db.prepare('UPDATE galleria_config SET fonte=?,includi_reel=? WHERE id=1').run(fonte, Number(reel))
}
export function getStatoWorker() {
  const s = db.prepare('SELECT * FROM maintenance_health WHERE id=1').get() as { heartbeat: number | null; last_success: number | null; error: string }
  return { attivo: Boolean(s.heartbeat && s.heartbeat > Date.now() - 2 * ORA), ultimoControllo: s.heartbeat, ultimoSuccesso: s.last_success, errore: s.error }
}
/** Nessun segreto viene incluso nello stato destinato all'interfaccia. */
export function getStatoInstagram() {
  const s = leggiStato()
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM foto_instagram').get() as { n: number }
  const configurato = Boolean(s.user_id && s.access_token)
  // Le configurazioni precedenti alla verifica contenevano una scadenza stimata.
  const scadenza = s.verificato_il ? s.token_scade_il : null
  const scaduto = Boolean(scadenza && Date.parse(scadenza) <= Date.now())
  const stato: 'scollegato' | 'ricollega' | 'errore' | 'da_verificare' | 'collegato' = !configurato ? 'scollegato' : scaduto || ['token', 'permessi', 'account'].includes(s.errore_codice) ? 'ricollega' : s.errore_codice ? 'errore' : !s.verificato_il || Date.parse(s.verificato_il) < Date.now() - 2 * GIORNO ? 'da_verificare' : 'collegato'
  return { configurato, stato, username: s.username, userId: s.user_id, tokenScadeIl: scadenza, ultimaSync: s.ultima_sync, ultimoTentativo: s.ultimo_tentativo, verificatoIl: s.verificato_il, ultimoEsito: s.ultimo_esito, erroreCodice: s.errore_codice, numeroFoto: n, revisione: s.revisione }
}
export async function leggiRisposta(res: Response, max: number): Promise<Buffer> {
  if (!res.body || Number(res.headers.get('content-length') || 0) > max) throw new ErroreInstagram('rete', 'Risposta Instagram non valida.')
  const reader = res.body.getReader(), chunks: Buffer[] = []
  let size = 0
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > max) throw new ErroreInstagram('rete', 'Risposta Instagram troppo grande.')
      chunks.push(Buffer.from(value))
    }
  } finally { await reader.cancel() }
  return Buffer.concat(chunks)
}
async function richiesta<T>(url: string | URL, token = '', init: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(url, { ...init, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000), headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers } })
    const dati = JSON.parse((await leggiRisposta(res, 1024 * 1024)).toString())
    if (!res.ok || dati.error) {
      const code = Number(dati.error?.code)
      if ([190, 102].includes(code) || res.status === 401) throw new ErroreInstagram('token', 'L’accesso a Instagram è scaduto o è stato revocato. Ricollega l’account.')
      if ([10, 200, 294].includes(code) || res.status === 403) throw new ErroreInstagram('permessi', 'Instagram non autorizza la lettura delle foto. Ricollega l’account e concedi il permesso richiesto.')
      if ([4, 17, 32, 613].includes(code) || res.status === 429) throw new ErroreInstagram('limite', 'Instagram ha limitato temporaneamente le richieste. Riproveremo più tardi.')
      throw new ErroreInstagram('api', `Instagram non disponibile (HTTP ${res.status}). Le foto salvate restano disponibili.`)
    }
    return dati as T
  } catch (e) {
    if (e instanceof ErroreInstagram) throw e
    throw new ErroreInstagram('rete', 'Connessione a Instagram non riuscita. Le foto salvate restano disponibili.')
  }
}
function api(percorso: string, fields: string, after?: string) {
  const u = new URL(`https://graph.instagram.com/${versioneApi()}/${percorso}`)
  u.searchParams.set('fields', fields)
  if (percorso.endsWith('/media')) u.searchParams.set('limit', '25')
  if (after) u.searchParams.set('after', after)
  return u
}
async function verificaToken(token: string): Promise<Profilo> {
  const p = await richiesta<Profilo>(api('me', 'id,username'), token)
  if (!/^\d{5,40}$/.test(p.id) || typeof p.username !== 'string' || !p.username) throw new ErroreInstagram('account', 'Instagram non ha restituito un account valido.')
  // Una lettura reale dei media verifica anche il permesso necessario alla galleria.
  await richiesta(api(`${p.id}/media`, 'id'), token)
  return p
}
function accodaCache() {
  db.prepare('INSERT OR IGNORE INTO file_da_eliminare(file,dopo) SELECT file,? FROM foto_instagram').run(Date.now() + 2 * GIORNO)
  db.prepare('DELETE FROM foto_instagram').run()
}
function salvaConnessione(p: Profilo, token: string, expiry: string | null, revisione: number) {
  const encrypted = cifraSegreto(token, chiave(DATA_DIR, 'app'))
  db.transaction(() => {
    const current = db.prepare('SELECT user_id,revisione FROM instagram_stato WHERE id=1').get() as { user_id: string; revisione: number }
    if (current.revisione !== revisione) throw new ErroreInstagram('conflitto', 'Il collegamento è cambiato durante l’operazione. Riprova.')
    if (current.user_id !== p.id) {
      accodaCache()
      db.prepare('UPDATE instagram_stato SET ultima_sync=NULL,ultimo_tentativo=NULL WHERE id=1').run()
    }
    db.prepare('UPDATE instagram_stato SET ultimo_rinnovo=? WHERE id=1').run(new Date().toISOString())
    db.prepare("UPDATE instagram_stato SET user_id=?,username=?,access_token=?,token_scade_il=?,verificato_il=?,errore_codice='',ultimo_esito='Account e lettura foto verificati',revisione=revisione+1 WHERE id=1").run(p.id, p.username.slice(0, 100), encrypted, expiry, new Date().toISOString())
    db.prepare('DELETE FROM instagram_oauth').run()
  }).immediate()
}
export async function salvaConfigInstagram(userId: string, token: string) {
  if (!token || token.length > 4096) throw new ErroreInstagram('configurazione', 'Inserisci un token valido per verificare il collegamento.')
  const s = leggiStato(), p = await verificaToken(token)
  if (userId && p.id !== userId) throw new ErroreInstagram('account', 'L’ID inserito non corrisponde all’account autorizzato dal token.')
  // Per un token incollato non inventiamo una data di scadenza.
  salvaConnessione(p, token, null, s.revisione)
}
export function scollegaInstagram() {
  db.transaction(() => {
    accodaCache()
    db.prepare("UPDATE instagram_stato SET user_id='',username='',access_token='',token_scade_il=NULL,verificato_il=NULL,ultima_sync=NULL,ultimo_tentativo=NULL,ultimo_rinnovo=NULL,ultimo_esito='Account scollegato e foto Instagram rimosse dal sito',errore_codice='',revisione=revisione+1 WHERE id=1").run()
    db.prepare('DELETE FROM instagram_oauth').run()
  }).immediate()
}
function registraEsito(s: RigaStato, ok: boolean, messaggio: string, codice = '', sync = false): Esito {
  const now = new Date().toISOString()
  db.prepare('UPDATE instagram_stato SET ultimo_tentativo=?,ultimo_esito=?,errore_codice=?,verificato_il=CASE WHEN ? THEN ? ELSE verificato_il END,ultima_sync=CASE WHEN ? THEN ? ELSE ultima_sync END WHERE id=1 AND revisione=?').run(now, messaggio, codice, Number(ok), now, Number(ok && sync), now, s.revisione)
  return { ok, messaggio }
}
function fallimento(s: RigaStato, e: unknown) { return registraEsito(s, false, e instanceof ErroreInstagram ? e.message : 'Operazione Instagram non riuscita. Riprova più tardi.', e instanceof ErroreInstagram ? e.codice : 'rete') }
export async function verificaInstagram() {
  const s = leggiStato()
  try {
    if (!s.access_token) throw new ErroreInstagram('token', 'Collega prima un account Instagram.')
    const p = await verificaToken(s.access_token)
    if (p.id !== s.user_id) throw new ErroreInstagram('account', 'Account e autorizzazione non corrispondono. Ricollega Instagram.')
    db.prepare('UPDATE instagram_stato SET username=?,token_scade_il=CASE WHEN verificato_il IS NULL THEN NULL ELSE token_scade_il END WHERE id=1 AND revisione=?').run(p.username, s.revisione)
    return registraEsito(s, true, 'Account e lettura foto verificati')
  } catch (e) { return fallimento(s, e) }
}
export function getFotoInstagram() {
  return db.prepare('SELECT id,ig_id,file,permalink,didascalia,nascosta,ordine FROM foto_instagram ORDER BY ordine,id').all() as { id: number; ig_id: string; file: string; permalink: string; didascalia: string; nascosta: number; ordine: number }[]
}
export async function sincronizzaInstagram(): Promise<Esito> {
  const s = leggiStato()
  if (!s.access_token) return { ok: false, messaggio: 'Collega prima un account Instagram.' }
  const lock = crypto.randomBytes(16).toString('hex')
  const acquired = db.prepare("INSERT INTO integration_locks VALUES('instagram',?,?) ON CONFLICT(job) DO UPDATE SET token=excluded.token,expires_at=excluded.expires_at WHERE expires_at<=?").run(lock, Date.now() + 10 * 60000, Date.now())
  if (!acquired.changes) return { ok: false, messaggio: 'Una sincronizzazione è già in corso. Attendi qualche minuto.' }
  const scaricate: string[] = []
  try {
    const config = getConfigGalleria()
    const media: MediaIG[] = [], cursori = new Set<string>()
    let after: string | undefined
    for (let page = 0; page < 4 && media.length < 9; page++) {
      const dati = await richiesta<{ data?: MediaIG[]; paging?: { cursors?: { after?: string }; next?: string } }>(api(`${s.user_id}/media`, 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp', after), s.access_token)
      if (!Array.isArray(dati.data)) throw new ErroreInstagram('api', 'Instagram ha restituito una galleria non valida.')
      media.push(...dati.data.filter(m => /^\d+$/.test(m.id) && ((['IMAGE', 'CAROUSEL_ALBUM'].includes(m.media_type) && m.media_url) || (config.includiReel && m.media_type === 'VIDEO' && m.thumbnail_url))))
      // Non seguiamo URL esterni restituiti dall'API: usiamo solo il cursore sul nostro host fisso.
      after = dati.paging?.next ? dati.paging.cursors?.after : undefined
      if (!after || after.length > 2048 || cursori.has(after)) break
      cursori.add(after)
    }
    const esistenti = new Map(getFotoInstagram().map(r => [r.ig_id, r]))
    const nuove: { m: MediaIG; file: string; nascosta: number }[] = []
    let errori = 0
    for (const m of [...new Map(media.map(m => [m.id, m])).values()].slice(0, 9)) {
      let file = esistenti.get(m.id)?.file
      if (!file) {
        try {
          const url = new URL(m.media_type === 'VIDEO' ? m.thumbnail_url! : m.media_url!)
          if (url.protocol !== 'https:' || url.username || url.password || url.port || !['cdninstagram.com', 'fbcdn.net'].some(host => url.hostname.endsWith('.' + host))) throw new Error('Host non ammesso')
          const img = await fetch(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000) })
          if (!img.ok) throw new Error('Download fallito')
          file = await salvaFotoBuffer(await leggiRisposta(img, MAX_FILE_BYTES), 1600)
          scaricate.push(file)
        } catch { errori++; continue }
      }
      nuove.push({ m, file, nascosta: esistenti.get(m.id)?.nascosta || 0 })
    }
    // Un'importazione parziale non sostituisce una galleria completa.
    if (errori) throw new ErroreInstagram('immagini', 'Alcune immagini non sono scaricabili. La galleria precedente è stata conservata; riprova più tardi.')
    db.transaction(() => {
      const current = db.prepare('SELECT revisione FROM instagram_stato WHERE id=1').get() as { revisione: number }
      if (current.revisione !== s.revisione) throw new ErroreInstagram('conflitto', 'L’account è cambiato: importazione annullata.')
      // Legge la visibilità aggiornata anche se modificata durante il download.
      const hidden = new Map(getFotoInstagram().map(r => [r.ig_id, r.nascosta]))
      accodaCache()
      const ins = db.prepare('INSERT INTO foto_instagram(ig_id,file,permalink,didascalia,scattata_il,ordine,nascosta) VALUES(?,?,?,?,?,?,?)')
      nuove.forEach(({ m, file, nascosta }, i) => ins.run(m.id, file, /^https:\/\/(www\.)?instagram\.com\//.test(m.permalink || '') ? m.permalink : '', (m.caption || '').slice(0, 280), m.timestamp || '', i, hidden.get(m.id) ?? nascosta))
      registraEsito(s, true, `Sincronizzate ${nuove.length} foto`, '', true)
    }).immediate()
    scaricate.length = 0
    return { ok: true, messaggio: `Sincronizzate ${nuove.length} foto` }
  } catch (e) { return fallimento(s, e) }
  finally {
    for (const file of scaricate) await eliminaFoto(file)
    db.prepare("DELETE FROM integration_locks WHERE job='instagram' AND token=?").run(lock)
  }
}
export async function rinnovaTokenInstagram(): Promise<Esito> {
  const s = leggiStato()
  if (!s.access_token) return { ok: false, messaggio: 'Instagram non collegato.' }
  try {
    const url = new URL('https://graph.instagram.com/refresh_access_token')
    url.searchParams.set('grant_type', 'ig_refresh_token'); url.searchParams.set('access_token', s.access_token)
    const dati = await richiesta<{ access_token: string; expires_in: number }>(url)
    if (!dati.access_token || !Number.isFinite(dati.expires_in) || dati.expires_in <= 0) throw new ErroreInstagram('api', 'Instagram non ha confermato il rinnovo.')
    const changed = db.prepare('UPDATE instagram_stato SET access_token=?,token_scade_il=?,ultimo_rinnovo=? WHERE id=1 AND revisione=? AND access_token=?').run(cifraSegreto(dati.access_token, chiave(DATA_DIR, 'app')), new Date(Date.now() + dati.expires_in * 1000).toISOString(), new Date().toISOString(), s.revisione, cifraCorrente(s))
    if (!changed.changes) return { ok: false, messaggio: 'Il collegamento è cambiato durante il rinnovo.' }
    return registraEsito(s, true, 'Autorizzazione rinnovata')
  } catch (e) { return fallimento(s, e) }
}
function cifraCorrente(s: RigaStato): string {
  const row = db.prepare('SELECT access_token FROM instagram_stato WHERE id=1 AND revisione=?').get(s.revisione) as { access_token: string } | undefined
  // Non sovrascrivere un token già rinnovato da un altro processo.
  if (!row || decifraSegreto(row.access_token, chiave(DATA_DIR, 'app')) !== s.access_token) return ''
  return row.access_token
}
const stateHash = (value: string) => crypto.createHash('sha256').update(value).digest('hex')
export function avviaOAuth(userId: number) {
  const config = configurazioneOAuth()
  if (!config.pronta) throw new ErroreInstagram('configurazione', config.messaggio)
  const state = crypto.randomBytes(32).toString('base64url')
  db.transaction(() => {
    db.prepare('DELETE FROM instagram_oauth WHERE expires_at<=? OR user_id=?').run(Date.now(), userId)
    db.prepare('INSERT INTO instagram_oauth VALUES(?,?,?,?)').run(stateHash(state), userId, Date.now() + 10 * 60000, getStatoInstagram().revisione)
  }).immediate()
  const url = new URL('https://www.instagram.com/oauth/authorize')
  Object.entries({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: 'code', scope: 'instagram_business_basic', state, force_reauth: 'true', enable_fb_login: '0' }).forEach(([k, v]) => url.searchParams.set(k, v))
  return { state, url: url.toString() }
}
export function consumaOAuth(state: string, cookie: string, userId: number) {
  if (!/^[\w-]{43}$/.test(state) || state !== cookie) throw new ErroreInstagram('oauth', 'Il collegamento è scaduto o non appartiene a questo browser. Riprova.')
  const row = db.prepare('DELETE FROM instagram_oauth WHERE state_hash=? AND user_id=? RETURNING expires_at,revisione').get(stateHash(state), userId) as { expires_at: number; revisione: number } | undefined
  if (!row || row.expires_at <= Date.now()) throw new ErroreInstagram('oauth', 'Il collegamento è scaduto o è già stato usato. Riprova.')
  return row.revisione
}
export async function completaOAuth(code: string, revisione: number) {
  const config = configurazioneOAuth()
  if (!config.pronta || !code || code.length > 4096) throw new ErroreInstagram('oauth', 'Configurazione o risposta Instagram non valida.')
  const body = new URLSearchParams({ client_id: config.clientId, client_secret: config.secret, grant_type: 'authorization_code', redirect_uri: config.redirectUri, code })
  const raw = await richiesta<{ access_token?: string; data?: { access_token: string }[] }>('https://api.instagram.com/oauth/access_token', '', { method: 'POST', body })
  if (raw.access_token && raw.data || raw.data && raw.data.length !== 1) throw new ErroreInstagram('oauth', 'Instagram ha restituito un’autorizzazione ambigua. Riprova.')
  const short = raw.access_token || raw.data?.[0]?.access_token
  if (!short) throw new ErroreInstagram('oauth', 'Autorizzazione Instagram non ricevuta.')
  const exchange = new URL('https://graph.instagram.com/access_token')
  exchange.searchParams.set('grant_type', 'ig_exchange_token'); exchange.searchParams.set('client_secret', config.secret); exchange.searchParams.set('access_token', short)
  const long = await richiesta<{ access_token: string; expires_in: number }>(exchange)
  if (!long.access_token || !Number.isFinite(long.expires_in) || long.expires_in <= 0) throw new ErroreInstagram('oauth', 'Instagram non ha confermato la durata dell’autorizzazione.')
  const p = await verificaToken(long.access_token)
  salvaConnessione(p, long.access_token, new Date(Date.now() + long.expires_in * 1000).toISOString(), revisione)
}
