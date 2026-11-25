import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { migra } from './migrations.ts'

export function apriDatabase(directory: string) {
  fs.mkdirSync(path.join(directory, 'uploads'), { recursive: true, mode: 0o700 })
  fs.chmodSync(directory, 0o700)
  fs.chmodSync(path.join(directory, 'uploads'), 0o700)
  const filename = path.join(directory, 'pub.db')
  const db = new Database(filename, { timeout: 10000 })
  fs.chmodSync(filename, 0o600)
  for (const suffix of ['-wal','-shm']) {
    try { fs.chmodSync(filename+suffix,0o600) }
    catch(error) { if ((error as NodeJS.ErrnoException).code!=='ENOENT') { db.close();throw error } }
  }
  // Worker di build e app possono avviarsi insieme: WAL/schema richiedono un lock breve.
  for (let attempt=0;;attempt++) {
    try {
      db.pragma('journal_mode = WAL')
      db.pragma('foreign_keys = ON')
      migra(db)
      break
    } catch(error) {
      const code=(error as {code?:string}).code
      if (!['SQLITE_BUSY','SQLITE_LOCKED'].includes(code || '') || attempt>=50) { db.close();throw error }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100)
    }
  }
  return db
}
