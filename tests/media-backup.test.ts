import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import Database from 'better-sqlite3'
import { apriDatabase } from '../lib/database.ts'
import { MediaStore, MAX_FILE_BYTES } from '../lib/media.ts'
import { creaBackup, ripristinaBackup, mediaReferenziati, pulisciMedia } from '../lib/backup.ts'

async function fixture(t: TestContext) {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'pub-media-')),dir=path.join(root,'data')
  const db=apriDatabase(dir),media=new MediaStore(path.join(dir,'uploads'),db)
  t.after(async()=>{db.close();await fs.rm(root,{recursive:true,force:true})})
  return {root,dir,db,media}
}
const image=()=>sharp({create:{width:16,height:16,channels:3,background:'#123456'}}).png().toBuffer()
test('rasterizza SVG e rifiuta immagini invalide o troppo grandi',async t=>{
  const {dir,media}=await fixture(t)
  const name=await media.salva(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><script>alert(1)</script><rect width="20" height="20" fill="red"/></svg>'))
  assert(name.endsWith('.webp'))
  assert.equal((await sharp(path.join(dir,'uploads',name)).metadata()).format,'webp')
  await assert.rejects(media.salva(Buffer.from('non è un’immagine')))
  await assert.rejects(media.salva(Buffer.alloc(MAX_FILE_BYTES+1)))
})
test('immagine precedente conservata dopo sostituzione fallita e pulizia rispettosa dei riferimenti',async t=>{
  const {dir,db,media}=await fixture(t)
  const name=await media.salva(await image())
  db.prepare('INSERT INTO foto_galleria(file) VALUES(?)').run(name)
  await assert.rejects(media.salva(Buffer.from('corrotta')))
  await fs.access(path.join(dir,'uploads',name))
  media.elimina(name)
  await pulisciMedia(db,dir,Date.now()+72*3600000)
  await fs.access(path.join(dir,'uploads',name))
  db.exec('DELETE FROM foto_galleria')
  await pulisciMedia(db,dir,Date.now()+72*3600000)
  await assert.rejects(fs.access(path.join(dir,'uploads',name)))
})
test('backup cifrato WAL, ripristino coerente e nessuna sessione resuscitata',async t=>{
  const {root,dir,db,media}=await fixture(t)
  const name=await media.salva(await image())
  db.prepare('INSERT INTO foto_galleria(file) VALUES(?)').run(name)
  db.exec("UPDATE impostazioni SET nome_pub='Il locale'; INSERT INTO admin_users VALUES(1,'admin','hash','owner',1,1); INSERT INTO admin_sessions VALUES('hash',1,9999999999999,9999999999999)")
  db.exec("INSERT INTO instagram_oauth VALUES('pending',1,9999999999999,0);INSERT INTO integration_locks VALUES('instagram','busy',9999999999999);UPDATE maintenance_health SET heartbeat=9999999999999")
  const key=crypto.randomBytes(32)
  const archive=await creaBackup(dir,path.join(root,'backups'),key)
  assert(!(await fs.readdir(archive)).includes('pub.db'))
  const destination=path.join(root,'restored')
  await ripristinaBackup(archive,destination,key)
  const restored=new Database(path.join(destination,'pub.db'))
  assert.equal((restored.prepare('SELECT nome_pub FROM impostazioni').get() as {nome_pub:string}).nome_pub,'Il locale')
  assert.equal((restored.prepare('SELECT count(*) AS n FROM admin_sessions').get() as {n:number}).n,0)
  assert.equal((restored.prepare('SELECT count(*) AS n FROM instagram_oauth').get() as {n:number}).n,0)
  assert.equal((restored.prepare('SELECT count(*) AS n FROM integration_locks').get() as {n:number}).n,0)
  assert.equal((restored.prepare('SELECT heartbeat FROM maintenance_health').get() as {heartbeat:null}).heartbeat,null)
  for(const file of mediaReferenziati(restored)) await fs.access(path.join(destination,'uploads',file))
  restored.close()
  await assert.rejects(ripristinaBackup(archive,destination,key))
  await assert.rejects(ripristinaBackup(archive,path.join(root,'wrong-key'),crypto.randomBytes(32)))
  await assert.rejects(fs.access(path.join(root,'wrong-key')))
  const encrypted=path.join(archive,'pub.db.enc'),buf=await fs.readFile(encrypted);buf[30]^=1;await fs.writeFile(encrypted,buf)
  await assert.rejects(ripristinaBackup(archive,path.join(root,'tampered'),key))
})
test('backup incompleto non viene pubblicato e file assenti sono segnalati',async t=>{
  const {root,dir,db}=await fixture(t)
  db.prepare('INSERT INTO foto_galleria(file) VALUES(?)').run('mancante.webp')
  const backupDir=path.join(root,'backups')
  await assert.rejects(creaBackup(dir,backupDir,crypto.randomBytes(32)))
  assert.deepEqual(await fs.readdir(backupDir),[])
})

test('backup prima dell’aggiornamento e ripristino di un database della versione precedente',async t=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'pub-legacy-backup-')),dir=path.join(root,'data')
  await fs.mkdir(path.join(dir,'uploads'),{recursive:true})
  t.after(()=>fs.rm(root,{recursive:true,force:true}))
  const old=new Database(path.join(dir,'pub.db'))
  old.exec("CREATE TABLE impostazioni (id INTEGER PRIMARY KEY,nome_pub TEXT,descrizione TEXT,indirizzo TEXT,telefono TEXT,email TEXT,facebook TEXT,instagram TEXT,orari TEXT); INSERT INTO impostazioni VALUES(1,'Locale precedente','','','','','','','[]')")
  old.pragma('journal_mode=WAL');old.close()
  const key=crypto.randomBytes(32),archive=await creaBackup(dir,path.join(root,'backups'),key),destination=path.join(root,'restored')
  await ripristinaBackup(archive,destination,key)
  const restored=new Database(path.join(destination,'pub.db'))
  assert.equal((restored.prepare('SELECT nome_pub FROM impostazioni').get() as {nome_pub:string}).nome_pub,'Locale precedente')
  assert.equal((restored.prepare('SELECT count(*) AS n FROM schema_migrations').get() as {n:number}).n,3)
  restored.close()
})
