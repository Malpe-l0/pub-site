import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

test('il modulo usato dalle Server Actions conserva la foto dopo errori di sostituzione o salvataggio',async t=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'pub-upload-action-'))
  const previous=process.env.DATA_DIR;process.env.DATA_DIR=dir
  const { db }=await import('../lib/db.ts')
  const { salvaFoto,fileDaForm }=await import('../lib/upload.ts')
  const { pulisciMedia }=await import('../lib/backup.ts')
  t.after(async()=>{db.close();if(previous)process.env.DATA_DIR=previous;else delete process.env.DATA_DIR;await fs.rm(dir,{recursive:true,force:true})})
  const bytes=await sharp({create:{width:10,height:10,channels:3,background:'red'}}).png().toBuffer()
  const old=await salvaFoto(new File([new Uint8Array(bytes)],'foto.png'))
  db.prepare('INSERT INTO foto_galleria(file) VALUES(?)').run(old)
  const bad=new FormData();bad.set('foto',new File(['corrotta'],'foto.jpg'))
  await assert.rejects(fileDaForm(bad,'foto',800,old))
  await fs.access(path.join(dir,'uploads',old))
  const valid=new FormData();valid.set('foto',new File([new Uint8Array(bytes)],'foto.png'))
  assert(await fileDaForm(valid,'foto',800,old))
  // Simula un UPDATE fallito: il database conserva il vecchio riferimento.
  await pulisciMedia(db,dir,Date.now()+72*3600000)
  await fs.access(path.join(dir,'uploads',old))
})
test('le credenziali Instagram precedenti e nuove sono cifrate senza essere restituite al pannello',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'pub-ig-secret-'))
  // Processo dedicato: non riutilizza il singleton DB del test precedente.
  const { spawn }=await import('node:child_process')
  const script=`import {db} from ${JSON.stringify(new URL('../lib/db.ts',import.meta.url).href)};
    import {salvaConfigInstagram,getStatoInstagram} from ${JSON.stringify(new URL('../lib/instagram.ts',import.meta.url).href)};
    import assert from 'node:assert/strict';
    globalThis.fetch=async u=>Response.json(String(u).includes('/media')?{data:[]}:{id:'1234567890',username:'locale'});
    await salvaConfigInstagram('1234567890','token-di-test');
    assert(db.prepare('SELECT access_token AS t FROM instagram_stato').get().t.startsWith('enc:v1:'));
    assert(!JSON.stringify(getStatoInstagram()).includes('token-di-test'));
    db.prepare('UPDATE instagram_stato SET access_token=?').run('token-precedente');getStatoInstagram();
    assert(db.prepare('SELECT access_token AS t FROM instagram_stato').get().t.startsWith('enc:v1:'));db.close();`
  try {
    await new Promise<void>((resolve,reject)=>{
      const child=spawn(process.execPath,['--input-type=module','-e',script],{env:{...process.env,DATA_DIR:dir,INSTAGRAM_API_VERSION:'v99.0'},stdio:['ignore','pipe','pipe']})
      let errors='';child.stderr.on('data',c=>{errors+=c});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(errors)))
    })
  } finally {await fs.rm(dir,{recursive:true,force:true})}
})
