import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'node:crypto'

// Autenticazione del pannello admin: un solo utente, password in ADMIN_PASSWORD.
// La sessione è un cookie httpOnly "scadenza.firma" firmato HMAC con
// SESSION_SECRET: niente stato lato server, niente dipendenze.

const NOME_COOKIE = 'sessione-admin'
const DURATA_SECONDI = 30 * 24 * 60 * 60 // 30 giorni

function segreto(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET mancante in .env.local')
  return s
}

function firma(payload: string): string {
  return crypto.createHmac('sha256', segreto()).update(payload).digest('base64url')
}

function confrontoSicuro(a: string, b: string): boolean {
  // Hash preliminare: lunghezze sempre uguali, nessuna fuga di informazioni.
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function verificaPassword(password: string): boolean {
  const attesa = process.env.ADMIN_PASSWORD
  if (!attesa) return false
  return confrontoSicuro(password, attesa)
}

export async function creaSessione() {
  const scadenza = String(Date.now() + DURATA_SECONDI * 1000)
  const negozio = await cookies()
  negozio.set(NOME_COOKIE, `${scadenza}.${firma(scadenza)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURATA_SECONDI,
  })
}

export async function distruggiSessione() {
  ;(await cookies()).delete(NOME_COOKIE)
}

export async function sessioneValida(): Promise<boolean> {
  const token = (await cookies()).get(NOME_COOKIE)?.value
  if (!token) return false
  const [scadenza, firmaRicevuta] = token.split('.')
  if (!scadenza || !firmaRicevuta) return false
  if (!confrontoSicuro(firmaRicevuta, firma(scadenza))) return false
  return Number(scadenza) > Date.now()
}

/** Da chiamare in cima a ogni pagina e server action del pannello admin. */
export async function richiediAdmin() {
  if (!(await sessioneValida())) redirect('/admin/login')
}
