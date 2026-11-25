import fs from 'node:fs/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pipeline } from 'node:stream/promises'
import Database from 'better-sqlite3'
import { migra } from './migrations.ts'
import { nomeFileSicuro } from './media.ts'

export function mediaReferenziati(db: Database.Database): Set<string> {
  const names = new Set<string>()
  for (const [table,column] of [['voci_menu','foto'],['eventi','immagine'],['servizi','logo'],['foto_galleria','file'],['foto_instagram','file']]) {
    if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(table)) continue
    for (const r of db.prepare(`SELECT ${column} AS file FROM ${table} WHERE ${column} IS NOT NULL`).all() as { file: string }[]) {
      if (nomeFileSicuro(r.file)) names.add(r.file)
    }
  }
  const columns = db.pragma('table_info(impostazioni)') as {name:string}[]
  const row = columns.some(c=>c.name==='branding_json') ? db.prepare('SELECT branding_json FROM impostazioni WHERE id=1').get() as {branding_json:string}|undefined : undefined
  const brand = row ? JSON.parse(row.branding_json) : {}
  for (const src of [brand.logo,brand.hero,...(brand.birre || []).map((b: { logo: string })=>b.logo)]) {
    if (typeof src === 'string' && src.startsWith('/uploads/') && nomeFileSicuro(src.slice(9))) names.add(src.slice(9))
  }
  return names
}
async function digest(file: string) {
  const hash = crypto.createHash('sha256')
  for await (const chunk of createReadStream(file)) hash.update(chunk)
  return hash.digest('hex')
}
async function cifraFile(source: string, target: string, key: Buffer) {
  const iv = crypto.randomBytes(12)
  await fs.writeFile(target,iv,{mode:0o600,flag:'wx'})
  const cipher = crypto.createCipheriv('aes-256-gcm',key,iv)
  await pipeline(createReadStream(source),cipher,createWriteStream(target,{flags:'a'}))
  await fs.appendFile(target,cipher.getAuthTag())
}
async function decifraFile(source: string, target: string, key: Buffer) {
  const handle = await fs.open(source,'r')
  const size = (await handle.stat()).size
  if (size < 28) { await handle.close(); throw new Error('Archivio non valido') }
  const iv=Buffer.alloc(12),tag=Buffer.alloc(16)
  try { await handle.read(iv,0,12,0); await handle.read(tag,0,16,size-16) } finally { await handle.close() }
  const decipher=crypto.createDecipheriv('aes-256-gcm',key,iv)
  decipher.setAuthTag(tag)
  await pipeline(createReadStream(source,{start:12,end:size-17}),decipher,createWriteStream(target,{flags:'wx',mode:0o600}))
}
export async function creaBackup(dataDir: string, backupDir: string, key: Buffer) {
  await fs.mkdir(backupDir,{recursive:true,mode:0o700})
  const name=`pub-${new Date().toISOString().replace(/[:.]/g,'-')}-${crypto.randomBytes(4).toString('hex')}`
  const folder=path.join(backupDir,`.${name}.partial`)
  await fs.mkdir(folder,{mode:0o700})
  let source: Database.Database | undefined, snapshot: Database.Database | undefined
  try {
    source=new Database(path.join(dataDir,'pub.db'),{readonly:true,fileMustExist:true,timeout:10000})
    await source.backup(path.join(folder,'snapshot.db'))
    source.close();source=undefined
    snapshot=new Database(path.join(folder,'snapshot.db'),{readonly:true})
    const names=[...mediaReferenziati(snapshot)]
    snapshot.close();snapshot=undefined
    await fs.mkdir(path.join(folder,'uploads'),{mode:0o700})
    const files: { name: string; sha256: string }[]=[]
    for (const name of ['pub.db',...names.map(n=>`uploads/${n}`)]) {
      const file=name==='pub.db'?path.join(folder,'snapshot.db'):path.join(dataDir,name)
      const stat=await fs.lstat(file)
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('File di backup non valido')
      await cifraFile(file,path.join(folder,name+'.enc'),key)
      files.push({name,sha256:await digest(file)})
    }
    await fs.writeFile(path.join(folder,'manifest.json'),JSON.stringify({format:1,createdAt:new Date().toISOString(),files}),{mode:0o600})
    await cifraFile(path.join(folder,'manifest.json'),path.join(folder,'manifest.json.enc'),key)
    await fs.rm(path.join(folder,'manifest.json'))
    await fs.rm(path.join(folder,'snapshot.db'))
    const target=path.join(backupDir,name)
    await fs.rename(folder,target)
    return target
  } catch(error) {
    source?.close();snapshot?.close()
    await fs.rm(folder,{recursive:true,force:true})
    throw error
  }
}
export async function ripristinaBackup(archive: string, destination: string, key: Buffer) {
  // Il ripristino avviene sempre in una directory nuova; non sovrascrive siti attivi.
  try { await fs.lstat(destination); throw new Error('La destinazione esiste già') }
  catch(error) { if ((error as NodeJS.ErrnoException).code!=='ENOENT') throw error }
  const temporary=destination+`.restore-${crypto.randomUUID()}`
  await fs.mkdir(temporary,{recursive:false,mode:0o700})
  try {
    await decifraFile(path.join(archive,'manifest.json.enc'),path.join(temporary,'manifest.json'),key)
    const manifest=JSON.parse(await fs.readFile(path.join(temporary,'manifest.json'),'utf8')) as { format:number;files:{name:string;sha256:string}[] }
    if (manifest.format!==1 || !Array.isArray(manifest.files) || manifest.files.length>5001 || manifest.files.filter(f=>f.name==='pub.db').length!==1) throw new Error('Manifest non valido')
    await fs.mkdir(path.join(temporary,'uploads'),{mode:0o700})
    for (const f of manifest.files) {
      if (!(f.name==='pub.db'||f.name.startsWith('uploads/')&&nomeFileSicuro(f.name.slice(8))) || !/^[a-f0-9]{64}$/.test(f.sha256)) throw new Error('Percorso di backup non valido')
      const target=path.join(temporary,f.name)
      await decifraFile(path.join(archive,f.name+'.enc'),target,key)
      if (await digest(target)!==f.sha256) throw new Error('Backup danneggiato')
    }
    const db=new Database(path.join(temporary,'pub.db'))
    try {
      if (db.pragma('quick_check',{simple:true})!=='ok') throw new Error('Database danneggiato')
      migra(db)
      db.exec("DELETE FROM admin_sessions; DELETE FROM login_limits; DELETE FROM maintenance_state; DELETE FROM instagram_oauth; DELETE FROM integration_locks; UPDATE maintenance_health SET heartbeat=NULL,last_success=NULL,error='';")
      db.pragma('wal_checkpoint(TRUNCATE)')
    } finally { db.close() }
    await fs.rm(path.join(temporary,'manifest.json'))
    await fs.rename(temporary,destination)
  } catch(error) { await fs.rm(temporary,{recursive:true,force:true});throw error }
}
export async function pulisciMedia(db: Database.Database, dataDir: string, now=Date.now()) {
  const references=mediaReferenziati(db)
  const folder=path.join(dataDir,'uploads')
  const pending=new Map((db.prepare('SELECT file,dopo FROM file_da_eliminare').all() as {file:string;dopo:number}[]).map(r=>[r.file,r.dopo]))
  for (const file of await fs.readdir(folder)) {
    if (references.has(file)||!nomeFileSicuro(file)) continue
    const stat=await fs.lstat(path.join(folder,file))
    if (!stat.isFile()||stat.isSymbolicLink()) continue
    if ((pending.get(file) ?? stat.mtimeMs+48*3600000)>now) continue
    await fs.rm(path.join(folder,file))
    db.prepare('DELETE FROM file_da_eliminare WHERE file=?').run(file)
  }
}
