import readline from 'node:readline/promises'
import { Writable } from 'node:stream'
import { db } from '../lib/db.ts'
import { audit, cambiaPassword, hashPassword, passwordValida } from '../lib/security.ts'
const username=(process.argv[2] || 'admin').toLowerCase()
if (!/^[a-z0-9._-]{3,64}$/.test(username)) throw new Error('Nome utente non valido')
const muted=new Writable({write(_chunk,_encoding,callback){callback()}})
const terminal=readline.createInterface({input:process.stdin,output:muted,terminal:true})
process.stdout.write('Nuova password (12–128 caratteri, digitazione nascosta): ')
const password=await terminal.question('')
process.stdout.write('\nRipeti password: ')
const confirmation=await terminal.question('')
terminal.close();process.stdout.write('\n')
if (!passwordValida(password)||password!==confirmation) throw new Error('Password non valida o conferma diversa')
const existing=db.prepare('SELECT id FROM admin_users WHERE username=?').get(username) as {id:number}|undefined
if (existing) {
  await cambiaPassword(db,existing.id,password)
  db.prepare('UPDATE admin_users SET active=1 WHERE id=?').run(existing.id)
} else {
  const hash=await hashPassword(password)
  const result=db.prepare("INSERT INTO admin_users (username,password_hash,role,created_at) VALUES (?,?,'owner',?)").run(username,hash,Date.now())
  audit(db,'account.recuperato_da_console',Number(result.lastInsertRowid))
}
db.prepare('DELETE FROM login_limits').run()
console.log('Account pronto. Le precedenti sessioni dell’account sono state revocate.')
db.close()
