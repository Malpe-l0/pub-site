import path from 'node:path'
import { creaBackup, ripristinaBackup } from '../lib/backup.ts'
import { chiave } from '../lib/secrets.ts'
const data=path.resolve(process.env.DATA_DIR || 'data')
const key=chiave(data,'backup')
if (process.argv[2]==='restore') {
  const [, , , archive,destination]=process.argv
  if (!archive||!destination) throw new Error('Uso: npm run backup:restore -- ARCHIVIO DIRECTORY_NUOVA')
  await ripristinaBackup(path.resolve(archive),path.resolve(destination),key)
  console.log('Ripristino verificato. Le sessioni precedenti sono state revocate. Configura la chiave app originale prima di riattivare Instagram.')
} else console.log('Backup cifrato:',await creaBackup(data,path.resolve(process.env.BACKUP_DIR || 'backups'),key))
