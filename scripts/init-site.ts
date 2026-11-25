import fs from 'node:fs/promises'
import path from 'node:path'
import { apriDatabase } from '../lib/database.ts'
import { chiave } from '../lib/secrets.ts'
const directory=process.argv[2]
const name=process.argv[3]
if (!directory||!name||name.length>120) throw new Error('Uso: npm run site:init -- DIRECTORY_NUOVA "Nome attività"')
const target=path.resolve(directory)
await fs.mkdir(target,{recursive:false,mode:0o700})
const db=apriDatabase(target)
db.prepare('UPDATE impostazioni SET nome_pub=? WHERE id=1').run(name)
chiave(target,'app');chiave(target,'backup')
db.close()
console.log('Nuovo sito vuoto creato. Configura DATA_DIR con questa directory e usa npm run admin:reset per creare il titolare. Conserva una copia separata delle chiavi in .keys/.')
