'use server'
import { redirect } from 'next/navigation'
import { creaSessione, inizializzaAdmin, indirizzoLogin } from '@/lib/auth'
import { db } from '@/lib/db'
import { audit, prenotaTentativo, tokenHash, verificaHash } from '@/lib/security'

export async function accedi(formData: FormData) {
  const username = String(formData.get('username') || 'admin').trim().toLowerCase().slice(0, 65)
  const password = String(formData.get('password') || '')
  const allowed = prenotaTentativo(db, [
    { key: 'global', max: 100 },
    { key: `user:${tokenHash(username)}`, max: 8 },
    { key: `ip:${tokenHash(await indirizzoLogin())}`, max: 40 },
  ])
  if (!allowed) redirect('/admin/login?errore=limite')
  await inizializzaAdmin()
  const user = db.prepare('SELECT id,password_hash FROM admin_users WHERE username=? AND active=1').get(username) as { id: number; password_hash: string } | undefined
  // Anche l'utente inesistente compie una verifica scrypt per ridurre l'enumerazione.
  const dummy = 'scrypt$' + '0'.repeat(32) + '$' + '0'.repeat(128)
  const valid = await verificaHash(password, user?.password_hash || dummy)
  if (!valid || !user) {
    audit(db, 'login.fallito')
    redirect('/admin/login?errore=credenziali')
  }
  db.prepare('DELETE FROM login_limits WHERE key=?').run(`user:${tokenHash(username)}`)
  if (!await creaSessione(user.id,user.password_hash)) redirect('/admin/login?errore=credenziali')
  audit(db, 'login.riuscito', user.id)
  redirect('/admin')
}
