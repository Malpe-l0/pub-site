'use server'
import { redirect } from 'next/navigation'
import { creaSessione, distruggiSessione, richiediAdmin, registraAudit } from '@/lib/auth'
import { db } from '@/lib/db'
import { cambiaPassword, hashPassword, passwordValida, verificaHash } from '@/lib/security'
import { numero, testo } from '@/lib/form'

export async function aggiornaPassword(form: FormData) {
  const user = await richiediAdmin()
  const row = db.prepare('SELECT password_hash FROM admin_users WHERE id=?').get(user.id) as { password_hash: string }
  if (!await verificaHash(String(form.get('attuale') || ''), row.password_hash)) redirect('/admin/account?errore=password')
  const password = String(form.get('nuova') || '')
  if (!passwordValida(password) || password !== form.get('conferma')) redirect('/admin/account?errore=nuova')
  await cambiaPassword(db, user.id, password, row.password_hash)
  await creaSessione(user.id)
  redirect('/admin/account?salvato=1')
}
export async function disconnettiTutti() {
  const user = await richiediAdmin()
  db.prepare('DELETE FROM admin_sessions WHERE user_id=?').run(user.id)
  registraAudit('account.sessioni_revocate', user.id)
  await distruggiSessione()
  redirect('/admin/login')
}
export async function creaUtente(form: FormData) {
  const owner = await richiediAdmin('owner')
  const username = testo(form, 'username').toLowerCase()
  const password = String(form.get('password') || '')
  if (!/^[a-z0-9._-]{3,64}$/.test(username) || !passwordValida(password)) redirect('/admin/account?errore=utente')
  const hash = await hashPassword(password)
  const created = db.prepare('INSERT OR IGNORE INTO admin_users (username,password_hash,role,created_at) VALUES (?,?,?,?)').run(username, hash, form.get('ruolo') === 'owner' ? 'owner' : 'editor', Date.now())
  if (!created.changes) redirect('/admin/account?errore=utente')
  registraAudit('account.utente_creato', owner.id)
  redirect('/admin/account?salvato=1')
}
export async function modificaUtente(form: FormData) {
  const owner = await richiediAdmin('owner')
  const id = numero(form, 'id')
  if (id === owner.id) redirect('/admin/account?errore=seStesso')
  const password = String(form.get('password') || '')
  if (password && !passwordValida(password)) redirect('/admin/account?errore=nuova')
  const hash = password ? await hashPassword(password) : null
  db.transaction(() => {
    if (hash) db.prepare('UPDATE admin_users SET password_hash=? WHERE id=?').run(hash, id)
    db.prepare('UPDATE admin_users SET active=? WHERE id=?').run(form.get('attivo') === 'on' ? 1 : 0, id)
    db.prepare('DELETE FROM admin_sessions WHERE user_id=?').run(id)
    registraAudit('account.utente_aggiornato', owner.id)
  }).immediate()
  redirect('/admin/account?salvato=1')
}
