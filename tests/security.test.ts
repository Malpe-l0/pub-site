import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import Database from 'better-sqlite3'
import { apriDatabase } from '../lib/database.ts'
import { cambiaPassword, hashPassword, verificaHash, nuovaSessione, leggiSessione, revocaSessione, prenotaTentativo } from '../lib/security.ts'
import { prezzo, numero, urlSicuro, dataValida } from '../lib/form.ts'
import { cifraSegreto, decifraSegreto } from '../lib/secrets.ts'
import crypto from 'node:crypto'

function fixture(t: TestContext) {
  const dir=mkdtempSync(path.join(os.tmpdir(),'pub-security-'))
  const db=apriDatabase(dir)
  t.after(()=>{db.close();rmSync(dir,{recursive:true,force:true})})
  return {db,dir}
}
test('migrazioni idempotenti e dati preesistenti conservati', t=>{
  const {db,dir}=fixture(t)
  db.prepare('UPDATE impostazioni SET nome_pub=? WHERE id=1').run('Locale esistente')
  const second=apriDatabase(dir)
  assert.equal((second.prepare('SELECT nome_pub FROM impostazioni').get() as {nome_pub:string}).nome_pub,'Locale esistente')
  assert.equal((second.prepare('SELECT count(*) AS n FROM schema_migrations').get() as {n:number}).n,3)
  second.close()
})
test('migra un database precedente senza stile_sito e mantiene le categorie', t=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'pub-legacy-'))
  const old=new Database(path.join(dir,'pub.db'))
  old.exec("CREATE TABLE impostazioni (id INTEGER PRIMARY KEY,nome_pub TEXT,descrizione TEXT,indirizzo TEXT,telefono TEXT,email TEXT,facebook TEXT,instagram TEXT,orari TEXT); INSERT INTO impostazioni VALUES(1,'Locale','','','','','','','[]'); CREATE TABLE categorie(id INTEGER PRIMARY KEY,nome TEXT,ordine INTEGER); INSERT INTO categorie VALUES(1,'Piatti',0)")
  old.close()
  const db=apriDatabase(dir)
  t.after(()=>{db.close();rmSync(dir,{recursive:true,force:true})})
  assert.equal((db.prepare('SELECT nome FROM categorie').get() as {nome:string}).nome,'Piatti')
  assert.equal((db.prepare('SELECT stile_sito FROM impostazioni').get() as {stile_sito:string}).stile_sito,'onepage')
})
test('scrypt verifica la password senza conservarla in chiaro',async()=>{
  const hash=await hashPassword('Una password lunga!')
  assert(!hash.includes('Una password'))
  assert(await verificaHash('Una password lunga!',hash))
  assert(!await verificaHash('Password differente',hash))
  assert(!await verificaHash('x','formato non valido'))
})
test('cookie revocato, cambio password, scadenza e inattività',async t=>{
  const {db}=fixture(t)
  db.prepare("INSERT INTO admin_users VALUES(1,'admin',?,'owner',1,?)").run(await hashPassword('Prima password sicura'),Date.now())
  const now=Date.now(),one=nuovaSessione(db,1,now),two=nuovaSessione(db,1,now)
  assert.equal(leggiSessione(db,one,now)?.id,1)
  assert.equal(leggiSessione(db,'123.firma',now),null)
  revocaSessione(db,one)
  assert.equal(leggiSessione(db,one,now),null)
  assert(leggiSessione(db,two,now))
  await cambiaPassword(db,1,'Nuova password sicura')
  assert.equal(leggiSessione(db,two),null)
  const next=nuovaSessione(db,1,now)
  assert.equal(leggiSessione(db,next,now+86400001),null)
  assert.equal(leggiSessione(db,next,now+8*86400000),null)
})
test('disabilitare un account interrompe immediatamente l’accesso',t=>{
  const {db}=fixture(t)
  db.exec("INSERT INTO admin_users VALUES(1,'admin','hash','owner',1,1)")
  const token=nuovaSessione(db,1)
  db.exec('UPDATE admin_users SET active=0')
  assert.equal(leggiSessione(db,token),null)
})
test('limite persistente condiviso fra processi e scadenza della finestra',t=>{
  const {db,dir}=fixture(t),other=apriDatabase(dir),now=Date.now()
  const keys=[{key:'user:uno',max:3}]
  assert(prenotaTentativo(db,keys,now));assert(prenotaTentativo(other,keys,now));assert(prenotaTentativo(db,keys,now))
  assert(!prenotaTentativo(other,keys,now))
  assert(prenotaTentativo(other,keys,now+16*60000));other.close()
})
test('una sessione non è valida nel database di un’altra attività',t=>{
  const a=fixture(t),b=fixture(t)
  a.db.exec("INSERT INTO admin_users VALUES(1,'admin','hash','owner',1,1)")
  assert.equal(leggiSessione(b.db,nuovaSessione(a.db,1)),null)
})
test('validazione di prezzi, numeri, date e link sul server',()=>{
  const form=new FormData();form.set('prezzo','12,50');assert.equal(prezzo(form),1250)
  for(const value of ['-2','NaN','1e8','12.345','']){form.set('prezzo',value);assert.throws(()=>prezzo(form))}
  form.set('id','-1');assert.throws(()=>numero(form,'id'))
  assert.throws(()=>urlSicuro('javascript:alert(1)'));assert.throws(()=>urlSicuro('https://user:pass@example.com'))
  assert.throws(()=>dataValida('2026-02-31'));assert.throws(()=>dataValida('2026-01-01T25:00',true))
  assert.equal(dataValida('2026-10-22T18:30',true),'2026-10-22T18:30')
})
test('segreti cifrati autenticati e manomissioni respinte',()=>{
  const key=crypto.randomBytes(32),value=cifraSegreto('token privato',key)
  assert(!value.includes('token privato'));assert.equal(decifraSegreto(value,key),'token privato')
  assert.throws(()=>decifraSegreto(value,crypto.randomBytes(32)))
})
test('un cambio password concorrente non può usare una verifica precedente',async t=>{
  const {db}=fixture(t),old=await hashPassword('Password precedente valida')
  db.prepare("INSERT INTO admin_users VALUES(1,'admin',?,'owner',1,1)").run(old)
  await cambiaPassword(db,1,'Password aggiornata valida',old)
  await assert.rejects(cambiaPassword(db,1,'Cambio ormai obsoleto',old))
  const row=db.prepare('SELECT password_hash FROM admin_users WHERE id=1').get() as {password_hash:string}
  assert(await verificaHash('Password aggiornata valida',row.password_hash))
})
test('rifiuta database creati da versioni future del codice',t=>{
  const {db,dir}=fixture(t)
  db.prepare('INSERT INTO schema_migrations VALUES(999,?)').run(Date.now())
  assert.throws(()=>apriDatabase(dir),/più recente/)
})
