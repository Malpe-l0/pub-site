import 'server-only'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from './db'
import { audit, hashPassword, leggiSessione, nuovaSessione, passwordValida, revocaSessione, SESSION_MS } from './security'

const COOKIE = 'sessione-admin-v2'
export async function inizializzaAdmin() {
  if (db.prepare('SELECT 1 FROM admin_users LIMIT 1').get()) return
  const password = process.env.ADMIN_PASSWORD
  if (!password || !passwordValida(password)) return
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase()
  if (!/^[a-z0-9._-]{3,64}$/.test(username)) throw new Error('ADMIN_USERNAME non valido')
  const hash = await hashPassword(password)
  db.transaction(() => {
    if (!db.prepare('SELECT 1 FROM admin_users LIMIT 1').get()) {
      const result = db.prepare("INSERT INTO admin_users (username,password_hash,role,created_at) VALUES (?,?,'owner',?)").run(username, hash, Date.now())
      audit(db, 'account.inizializzato', Number(result.lastInsertRowid))
    }
  }).immediate()
}
export async function utenteCorrente() {
  const token = (await cookies()).get(COOKIE)?.value
  return token ? leggiSessione(db, token) : null
}
export async function sessioneValida() { return Boolean(await utenteCorrente()) }
export async function creaSessione(userId: number, expectedHash?: string) {
  const jar = await cookies()
  const old = jar.get(COOKIE)?.value
  const token = db.transaction(() => {
    const current = db.prepare('SELECT password_hash FROM admin_users WHERE id=? AND active=1').get(userId) as {password_hash:string}|undefined
    if (!current || expectedHash && current.password_hash !== expectedHash) return null
    if (old) revocaSessione(db, old)
    return nuovaSessione(db,userId)
  }).immediate()
  if (!token) return false
  jar.set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: SESSION_MS / 1000,
  })
  jar.delete('sessione-admin')
  return true
}
export async function distruggiSessione() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) revocaSessione(db, token)
  jar.delete(COOKIE)
  jar.delete('sessione-admin')
}
export async function richiediAdmin(role: 'editor' | 'owner' = 'editor') {
  const user = await utenteCorrente()
  if (!user) redirect('/admin/login')
  if (role === 'owner' && user.role !== 'owner') redirect('/admin/account?errore=permessi')
  return user
}
export function registraAudit(event: string, userId: number) { audit(db, event, userId) }
export async function indirizzoLogin() {
  // Fidarsi dell'header solo se il proxy configurato lo sovrascrive, mai dal client diretto.
  if (process.env.TRUST_PROXY !== '1') return 'direct'
  return (await headers()).get('x-real-ip')?.slice(0, 64) || 'unknown'
}
