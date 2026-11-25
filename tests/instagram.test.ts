import {test,beforeEach,after} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
const root=await fs.mkdtemp(path.join(os.tmpdir(),'pub-instagram-'))
process.env.DATA_DIR=root
process.env.INSTAGRAM_API_VERSION='v99.0'
process.env.INSTAGRAM_APP_ID='1234567890'
process.env.INSTAGRAM_APP_SECRET='test-secret'
process.env.INSTAGRAM_REDIRECT_URI='https://example.test/admin/instagram/callback'
const {db}=await import('../lib/db.ts')
const ig=await import('../lib/instagram.ts')
const realFetch=globalThis.fetch
const png=await sharp({create:{width:12,height:12,channels:3,background:'red'}}).png().toBuffer()
const json=(value:unknown,status=200)=>Response.json(value,{status})
const profile={id:'1234567890',username:'locale'}
const post=(id='1')=>({id,media_type:'IMAGE',media_url:'https://a.cdninstagram.com/photo.jpg',permalink:'https://www.instagram.com/p/photo/',caption:'La sala'})
beforeEach(()=>{
  db.exec("DELETE FROM instagram_oauth;DELETE FROM integration_locks;DELETE FROM foto_instagram;DELETE FROM foto_galleria;DELETE FROM admin_users;UPDATE instagram_stato SET user_id='',access_token='',username='',ultima_sync=NULL,ultimo_tentativo=NULL,verificato_il=NULL,token_scade_il=NULL,ultimo_rinnovo=NULL,ultimo_esito='',errore_codice='',revisione=0;UPDATE galleria_config SET fonte='automatica',includi_reel=0;INSERT INTO admin_users VALUES(1,'owner','hash','owner',1,1);INSERT INTO admin_users VALUES(2,'other','hash','owner',1,1)")
  globalThis.fetch=async()=>{throw new Error('Richiesta esterna non simulata')}
})
after(async()=>{globalThis.fetch=realFetch;db.close();await fs.rm(root,{recursive:true,force:true})})
async function connect(){
  globalThis.fetch=async u=>String(u).includes('/media')?json({data:[]}):json(profile)
  await ig.salvaConfigInstagram('', 'private-token')
}
test('verifica profilo e lettura media prima di salvare, cifra il token e non inventa la scadenza',async()=>{
  await connect()
  const s=ig.getStatoInstagram()
  assert.equal(s.stato,'collegato');assert.equal(s.username,'locale');assert.equal(s.tokenScadeIl,null)
  assert(!JSON.stringify(s).includes('private-token'))
  assert((db.prepare('SELECT access_token AS t FROM instagram_stato').get() as {t:string}).t.startsWith('enc:v1:'))
  await assert.rejects(ig.salvaConfigInstagram('9999999999','new-token'))
  assert.equal(ig.getStatoInstagram().userId,profile.id)
})
test('un permesso negato non sostituisce l’account precedente',async()=>{
  await connect()
  globalThis.fetch=async u=>String(u).includes('/media')?json({error:{code:10,message:'non mostrare token!'}},403):json(profile)
  await assert.rejects(ig.salvaConfigInstagram('', 'invalid-token'))
  assert.equal(ig.getStatoInstagram().revisione,1)
})
test('OAuth usa state monouso, scadenza e associazione al browser e al titolare',()=>{
  const auth=ig.avviaOAuth(1),url=new URL(auth.url)
  assert.equal(url.origin,'https://www.instagram.com');assert.equal(url.searchParams.get('scope'),'instagram_business_basic')
  assert.throws(()=>ig.consumaOAuth(auth.state,'altro-browser',1))
  assert.throws(()=>ig.consumaOAuth(auth.state,auth.state,2))
  assert.equal(ig.consumaOAuth(auth.state,auth.state,1),0)
  assert.throws(()=>ig.consumaOAuth(auth.state,auth.state,1))
  const expired=ig.avviaOAuth(1);db.exec('UPDATE instagram_oauth SET expires_at=0')
  assert.throws(()=>ig.consumaOAuth(expired.state,expired.state,1))
})
test('OAuth scambia codice e token, verifica la lettura e usa expires_in restituito da Meta',async()=>{
  const start=Date.now()
  globalThis.fetch=async (u,init)=>{
    const url=new URL(String(u))
    if(url.hostname==='api.instagram.com'){
      assert.equal(init?.method,'POST');assert.equal((init?.body as URLSearchParams).get('client_secret'),'test-secret')
      return json({access_token:'short-token'})
    }
    if(url.pathname==='/access_token')return json({access_token:'long-token',expires_in:200000})
    return url.pathname.endsWith('/media')?json({data:[]}):json(profile)
  }
  await ig.completaOAuth('code',0)
  const s=ig.getStatoInstagram();assert.equal(s.stato,'collegato')
  assert(Date.parse(s.tokenScadeIl!)>=start+200000000)
})
test('cambio account e scollegamento cancellano cache, autorizzazione e stati OAuth precedenti',async()=>{
  await connect();db.exec("INSERT INTO foto_instagram(ig_id,file) VALUES('1','old.webp');INSERT INTO foto_galleria(file) VALUES('manual.webp')")
  const auth=ig.avviaOAuth(1)
  globalThis.fetch=async u=>String(u).includes('/media')?json({data:[]}):json({id:'9999999999',username:'nuovo'})
  await ig.salvaConfigInstagram('','new-token')
  assert.equal(ig.getFotoInstagram().length,0);assert.equal(ig.getStatoInstagram().ultimaSync,null)
  assert.throws(()=>ig.consumaOAuth(auth.state,auth.state,1))
  assert(db.prepare('SELECT 1 FROM file_da_eliminare WHERE file=?').get('old.webp'))
  ig.scollegaInstagram();assert.equal(ig.getStatoInstagram().stato,'scollegato')
  assert(db.prepare('SELECT 1 FROM foto_galleria').get())
  assert.equal((db.prepare('SELECT access_token AS t FROM instagram_stato').get() as {t:string}).t,'')
})
test('API scaduta e rate limit conservano la cache e l’ultima sincronizzazione riuscita',async()=>{
  await connect();db.exec("INSERT INTO foto_instagram(ig_id,file) VALUES('1','old.webp');UPDATE instagram_stato SET ultima_sync='2026-01-01T00:00:00Z'")
  globalThis.fetch=async()=>json({error:{code:190,message:'segreto'}},400)
  assert.equal((await ig.sincronizzaInstagram()).ok,false)
  assert.equal(ig.getStatoInstagram().stato,'ricollega');assert.equal(ig.getStatoInstagram().ultimaSync,'2026-01-01T00:00:00Z');assert(ig.getStatoInstagram().ultimoTentativo)
  assert.equal(ig.getFotoInstagram().length,1);assert(!ig.getStatoInstagram().ultimoEsito.includes('segreto'))
  globalThis.fetch=async()=>json({error:{code:4}},429)
  await ig.sincronizzaInstagram();assert.equal(ig.getStatoInstagram().erroreCodice,'limite')
})
test('paginazione e copertine Reel, visibilità conservata e URL CDN controllati',async()=>{
  await connect();ig.salvaConfigGalleria('mista',true)
  db.exec("INSERT INTO foto_instagram(ig_id,file,nascosta) VALUES('1','old.webp',1)")
  let pages=0
  globalThis.fetch=async u=>{
    const url=new URL(String(u))
    if(url.hostname==='a.cdninstagram.com')return new Response(new Uint8Array(png))
    pages++
    if(pages===1)return json({data:[post()],paging:{next:'https://evil.test/steal',cursors:{after:'next-cursor'}}})
    assert.equal(url.hostname,'graph.instagram.com');assert.equal(url.searchParams.get('after'),'next-cursor')
    return json({data:[{id:'2',media_type:'VIDEO',thumbnail_url:'https://a.cdninstagram.com/reel.jpg'}]})
  }
  assert.equal((await ig.sincronizzaInstagram()).ok,true)
  assert.equal(ig.getFotoInstagram().length,2);assert.equal(ig.getFotoInstagram()[0].nascosta,1)
  assert.equal(ig.getFotoInstagram()[0].didascalia,'La sala')
})
test('download parziale o URL non sicuro non sostituiscono la galleria precedente',async()=>{
  await connect();db.exec("INSERT INTO foto_instagram(ig_id,file) VALUES('1','old.webp')")
  const requested:string[]=[]
  globalThis.fetch=async u=>{requested.push(String(u));return json({data:[{...post('2'),media_url:'http://127.0.0.1/private'}]})}
  assert.equal((await ig.sincronizzaInstagram()).ok,false)
  assert.equal(ig.getFotoInstagram()[0].file,'old.webp');assert.equal(requested.length,1)
})
test('una sincronizzazione iniziata prima dello scollegamento non può ripubblicare le foto',async()=>{
  await connect()
  globalThis.fetch=async u=>{
    if(String(u).includes('cdninstagram')){ig.scollegaInstagram();return new Response(new Uint8Array(png))}
    return json({data:[post()]})
  }
  assert.equal((await ig.sincronizzaInstagram()).ok,false)
  assert.equal(ig.getFotoInstagram().length,0);assert.equal(ig.getStatoInstagram().stato,'scollegato')
})
test('rinnovo fallito visibile e rinnovo riuscito con scadenza reale',async()=>{
  await connect();globalThis.fetch=async()=>json({error:{code:190}},400)
  assert.equal((await ig.rinnovaTokenInstagram()).ok,false);assert.equal(ig.getStatoInstagram().erroreCodice,'token')
  globalThis.fetch=async()=>json({access_token:'renewed',expires_in:10000})
  assert.equal((await ig.rinnovaTokenInstagram()).ok,true);assert(ig.getStatoInstagram().tokenScadeIl);assert.equal(ig.getStatoInstagram().erroreCodice,'')
})

test('una scadenza stimata precedente non viene mostrata come dato verificato',async()=>{
  db.exec("UPDATE instagram_stato SET user_id='1234567890',access_token='legacy-token',token_scade_il='2020-01-01T00:00:00Z'")
  assert.equal(ig.getStatoInstagram().tokenScadeIl,null)
  assert.equal(ig.getStatoInstagram().stato,'da_verificare')
  globalThis.fetch=async u=>String(u).includes('/media')?json({data:[]}):json(profile)
  assert.equal((await ig.verificaInstagram()).ok,true)
  assert.equal(ig.getStatoInstagram().tokenScadeIl,null)
  assert.equal(ig.getStatoInstagram().stato,'collegato')
})
