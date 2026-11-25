import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { apriDatabase } from '../lib/database.ts'

test('Instagram non disponibile non impedisce backup e pulizia dei file scaduti',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'pub-worker-')),dir=path.join(root,'data')
  const db=apriDatabase(dir)
  db.prepare('UPDATE instagram_stato SET user_id=?,access_token=?,token_scade_il=?').run('1234567890','token-di-test','2020-01-01T00:00:00Z')
  db.prepare('INSERT INTO file_da_eliminare VALUES (?,0)').run('scaduto.webp')
  db.close()
  await fs.writeFile(path.join(dir,'uploads','scaduto.webp'),'immagine non più usata')
  const script=`globalThis.fetch=async()=>new Response('{}',{status:503});await import(${JSON.stringify(new URL('../scripts/maintenance.ts',import.meta.url).href)});`
  try {
    const code=await new Promise<number|null>((resolve,reject)=>{
      const child=spawn(process.execPath,['--input-type=module','-e',script],{env:{...process.env,DATA_DIR:dir,BACKUP_DIR:path.join(root,'backups')},stdio:'ignore'})
      child.on('error',reject);child.on('exit',resolve)
    })
    assert.equal(code,1)
    assert((await fs.readdir(path.join(root,'backups'))).some(n=>n.startsWith('pub-')))
    await assert.rejects(fs.access(path.join(dir,'uploads','scaduto.webp')))
  } finally {await fs.rm(root,{recursive:true,force:true})}
})
