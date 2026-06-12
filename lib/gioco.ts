import crypto from 'node:crypto'

// Controlli lato server per la classifica del gioco della spillata.
// Dichiaratamente "best effort": è la classifica di un pub, non una banca.
// Tengono fuori lo script kiddie, non l'ostinato — e va bene così.

const DURATA_TOKEN_MS = 2 * 60 * 60 * 1000 // una partita inizia entro 2 ore

function segreto(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET mancante in .env.local')
  return s
}

function firma(payload: string): string {
  return crypto
    .createHmac('sha256', 'gioco:' + segreto())
    .update(payload)
    .digest('base64url')
}

/** Token emesso col page load: prova che la partita è iniziata dal sito. */
export function creaTokenPartita(): string {
  const adesso = String(Date.now())
  return `${adesso}.${firma(adesso)}`
}

/** Verifica firma ed età del token; restituisce il timestamp di emissione. */
export function verificaTokenPartita(token: string): number | null {
  const [timestamp, firmaRicevuta] = token.split('.')
  if (!timestamp || !firmaRicevuta) return null

  const attesa = firma(timestamp)
  const a = Buffer.from(firmaRicevuta)
  const b = Buffer.from(attesa)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  const emesso = Number(timestamp)
  const eta = Date.now() - emesso
  if (!Number.isFinite(emesso) || eta < 0 || eta > DURATA_TOKEN_MS) return null
  return emesso
}

/**
 * Un punteggio è plausibile se compatibile col tempo di gioco dichiarato:
 * anche spillando alla perfezione non si superano ~40 punti al secondo
 * (cap generoso, contano gli ordini di grandezza).
 */
export function punteggioPlausibile(punteggio: number, durataMs: number): boolean {
  if (!Number.isInteger(punteggio) || punteggio < 0 || punteggio > 100_000) return false
  if (!Number.isFinite(durataMs) || durataMs <= 0) return false
  return punteggio <= 40 + (durataMs / 1000) * 50
}

// Rate limit in memoria: si azzera al riavvio, non sopravvive a più processi.
// Per un sito su un singolo VPS è sufficiente.
const invii = new Map<string, number[]>()
const FINESTRA_MS = 60_000
const MAX_INVII = 5

export function rateLimitSuperato(ip: string): boolean {
  const adesso = Date.now()
  const recenti = (invii.get(ip) ?? []).filter((t) => adesso - t < FINESTRA_MS)
  if (recenti.length >= MAX_INVII) {
    invii.set(ip, recenti)
    return true
  }
  recenti.push(adesso)
  invii.set(ip, recenti)

  // Pulizia spicciola per non far crescere la mappa all'infinito.
  if (invii.size > 1000) {
    for (const [chiave, tempi] of invii) {
      if (tempi.every((t) => adesso - t >= FINESTRA_MS)) invii.delete(chiave)
    }
  }
  return false
}
