import crypto from 'node:crypto'
import type Database from 'better-sqlite3'

const scrypt = (password: string, salt: string) => new Promise<Buffer>((resolve,reject) => crypto.scrypt(password,salt,64,COST,(error,key) => error ? reject(error) : resolve(key)))
const COST = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }
export const SESSION_MS = 7 * 24 * 3600 * 1000
const IDLE_MS = 24 * 3600 * 1000
export type AdminUser = { id: number; username: string; role: 'owner' | 'editor' }
export function passwordValida(password: string) {
  return password.length >= 12 && password.length <= 128
}
export async function hashPassword(password: string) {
  if (password.length > 128) throw new Error('Password troppo lunga')
  const salt = crypto.randomBytes(16).toString('hex')
  const key = await scrypt(password, salt)
  return `scrypt$${salt}$${key.toString('hex')}`
}
export async function verificaHash(password: string, encoded: string) {
  if (password.length > 128) return false
  const [scheme, salt, hash] = encoded.split('$')
  if (scheme !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(hash)) return false
  const key = await scrypt(password, salt)
  return crypto.timingSafeEqual(key, Buffer.from(hash, 'hex'))
}
export function tokenHash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}
export function audit(db: Database.Database, event: string, userId: number | null = null) {
  db.prepare('INSERT INTO audit_log (user_id,event,created_at) VALUES (?,?,?)').run(userId, event, Date.now())
}
export function nuovaSessione(db: Database.Database, userId: number, now = Date.now()) {
  db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ? OR last_seen <= ?').run(now, now - IDLE_MS)
  const token = crypto.randomBytes(32).toString('base64url')
  db.prepare('INSERT INTO admin_sessions VALUES (?,?,?,?)').run(tokenHash(token), userId, now + SESSION_MS, now)
  return token
}
export function leggiSessione(db: Database.Database, token: string, now = Date.now()): AdminUser | null {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null
  const user = db.prepare(`SELECT u.id, u.username, u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>? AND s.last_seen>? AND u.active=1`).get(tokenHash(token), now, now - IDLE_MS) as AdminUser | undefined
  if (!user) return null
  db.prepare('UPDATE admin_sessions SET last_seen=? WHERE token_hash=? AND last_seen<?').run(now, tokenHash(token), now - 60000)
  return user
}
export function revocaSessione(db: Database.Database, token: string) {
  db.prepare('DELETE FROM admin_sessions WHERE token_hash=?').run(tokenHash(token))
}
export async function cambiaPassword(db: Database.Database, userId: number, password: string, expectedHash?: string) {
  if (!passwordValida(password)) throw new Error('Usa una password da 12 a 128 caratteri.')
  const hash = await hashPassword(password)
  db.transaction(() => {
    const current = db.prepare('SELECT password_hash FROM admin_users WHERE id=? AND active=1').get(userId) as {password_hash:string}|undefined
    if (!current || expectedHash && current.password_hash !== expectedHash) throw new Error('Account modificato; accedi nuovamente.')
    db.prepare('UPDATE admin_users SET password_hash=? WHERE id=?').run(hash, userId)
    db.prepare('DELETE FROM admin_sessions WHERE user_id=?').run(userId)
    audit(db, 'account.password_cambiata', userId)
  }).immediate()
}
// La prenotazione avviene prima della verifica costosa: limita anche tentativi paralleli.
export function prenotaTentativo(db: Database.Database, keys: { key: string; max: number }[], now = Date.now()) {
  return db.transaction(() => {
    db.prepare('DELETE FROM login_limits WHERE reset_at<=?').run(now)
    for (const { key, max } of keys) {
      const row = db.prepare('SELECT count FROM login_limits WHERE key=?').get(key) as { count: number } | undefined
      if (row && row.count >= max) return false
    }
    for (const { key } of keys) db.prepare(`INSERT INTO login_limits VALUES (?,1,?)
      ON CONFLICT(key) DO UPDATE SET count=count+1`).run(key, now + 15 * 60000)
    return true
  }).immediate()
}
