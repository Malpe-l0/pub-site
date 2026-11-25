import path from 'node:path'
import fs from 'node:fs/promises'
import { db, DATA_DIR } from '../lib/db.ts'
import { creaBackup, pulisciMedia } from '../lib/backup.ts'
import { chiave } from '../lib/secrets.ts'
import { getStatoInstagram, rinnovaTokenInstagram, sincronizzaInstagram } from '../lib/instagram.ts'

async function esegui() {
  const now=Date.now()
  // Lease condivisa con gli altri worker sullo stesso disco, con scadenza dopo un crash.
  const locked=db.transaction(()=>{
    const row=db.prepare("SELECT last_run FROM maintenance_state WHERE job='lease'").get() as {last_run:number}|undefined
    if (row && row.last_run>now-3600000) return true
    db.prepare("INSERT INTO maintenance_state VALUES ('lease',?) ON CONFLICT(job) DO UPDATE SET last_run=excluded.last_run").run(now)
    return false
  }).immediate()
  if (locked) return
  db.prepare('UPDATE maintenance_health SET heartbeat=? WHERE id=1').run(now)
  const failures: string[]=[]
  try {
    try {
    const last=db.prepare("SELECT last_run FROM maintenance_state WHERE job='backup'").get() as {last_run:number}|undefined
    if (!last || last.last_run<now-86400000) {
      const root=path.resolve(process.env.BACKUP_DIR || 'backups')
      await creaBackup(DATA_DIR,root,chiave(DATA_DIR,'backup'))
      db.prepare("INSERT INTO maintenance_state VALUES ('backup',?) ON CONFLICT(job) DO UPDATE SET last_run=excluded.last_run").run(now)
      // Conserva 30 giorni; non tocca directory estranee o backup incompleti.
      for (const file of await fs.readdir(root,{withFileTypes:true})) {
        if (file.isDirectory() && /^pub-\d{4}-\d{2}-\d{2}T[\dTZ-]+-[a-f0-9]{8}$/.test(file.name) && (await fs.stat(path.join(root,file.name))).mtimeMs<now-30*86400000) await fs.rm(path.join(root,file.name),{recursive:true})
      }
    }
    } catch { failures.push('backup') }
    try {
    const ig=getStatoInstagram()
    if (ig.configurato) {
      const lastRefresh = db.prepare('SELECT ultimo_rinnovo FROM instagram_stato WHERE id=1').get() as {ultimo_rinnovo:string|null}
      const canRefresh = !lastRefresh.ultimo_rinnovo || Date.parse(lastRefresh.ultimo_rinnovo)<now-86400000
      if (canRefresh && (!ig.tokenScadeIl || new Date(ig.tokenScadeIl).getTime()<now+14*86400000)) {
        const result=await rinnovaTokenInstagram()
        if (!result.ok) failures.push('instagram')
      }
      if (!ig.ultimaSync || new Date(ig.ultimaSync).getTime()<now-6*3600000) {
        const result=await sincronizzaInstagram()
        if (!result.ok) throw new Error(result.messaggio)
      }
    }
    } catch { failures.push('instagram') }
    await pulisciMedia(db,DATA_DIR)
    db.prepare('DELETE FROM admin_sessions WHERE expires_at<=? OR last_seen<=?').run(now,now-86400000)
    db.prepare('DELETE FROM login_limits WHERE reset_at<=?').run(now)
    db.prepare('DELETE FROM audit_log WHERE created_at<?').run(now-180*86400000)
    db.prepare('DELETE FROM instagram_oauth WHERE expires_at<=?').run(now)
    db.prepare('DELETE FROM integration_locks WHERE expires_at<=?').run(now)
    db.prepare('UPDATE maintenance_health SET error=?,last_success=CASE WHEN ? THEN ? ELSE last_success END WHERE id=1').run(failures.length?'Controllare '+[...new Set(failures)].map(f=>f==='instagram'?'il collegamento Instagram':'la destinazione dei backup').join(' e ')+'.':'',Number(failures.length===0),Date.now())
    if (failures.length) throw new Error('Manutenzione parziale')
    console.log('Manutenzione completata',new Date().toISOString())
  } catch(error) {
    db.prepare("UPDATE maintenance_health SET error=CASE WHEN error='' THEN 'Il servizio automatico non ha completato il lavoro. Contattare chi gestisce il sito.' ELSE error END WHERE id=1").run()
    throw error
  } finally { db.prepare("DELETE FROM maintenance_state WHERE job='lease' AND last_run=?").run(now) }
}
const run=()=>esegui().catch(()=>{console.error('Manutenzione non completata: controllare spazio, destinazione backup e collegamento Instagram.');process.exitCode=1})
await run()
if (process.argv.includes('--watch')) {
  process.exitCode=0
  setInterval(async()=>{await run();process.exitCode=0},3600000)
} else db.close()
