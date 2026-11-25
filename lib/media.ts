import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import type Database from 'better-sqlite3'

export const MAX_FILE_BYTES = 8 * 1024 * 1024
export const MAX_FILES = 5
export const nomeFileSicuro = (name: string) => /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}\.(webp|svg)$/.test(name) && !name.includes('..')
export class MediaStore {
  private directory: string
  private db: Database.Database
  constructor(directory: string, db: Database.Database) { this.directory=directory; this.db=db }
  async salva(buffer: Buffer, width = 1600) {
    if (!buffer.length || buffer.length > MAX_FILE_BYTES) throw new Error('Le immagini devono pesare al massimo 8 MB.')
    const entries = await fs.readdir(this.directory, { withFileTypes: true })
    let total = 0
    for (const entry of entries) if (entry.isFile()) total += (await fs.stat(path.join(this.directory, entry.name))).size
    const quota = Number(process.env.MAX_UPLOAD_BYTES || 1024 * 1024 * 1024)
    if (!Number.isSafeInteger(quota) || quota <= 0 || total + buffer.length > quota || entries.length >= 5000) throw new Error('Spazio immagini esaurito.')
    const image = sharp(buffer, { limitInputPixels: 32_000_000, failOn: 'error' })
    const metadata = await image.metadata()
    if (!['jpeg','png','webp','gif','heif','avif','svg'].includes(metadata.format || '') || (metadata.pages || 1) > 1) throw new Error('Formato immagine non supportato. Usa un’immagine statica.')
    // Anche gli SVG sono rasterizzati: nessun contenuto attivo viene pubblicato.
    const name = `${crypto.randomUUID()}.webp`
    const temporary = path.join(this.directory, `.${name}.tmp`)
    try {
      await image.rotate().resize({ width, height: width * 2, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(temporary)
      await fs.chmod(temporary, 0o600)
      await fs.rename(temporary, path.join(this.directory, name))
      return name
    } catch (error) { await fs.rm(temporary, { force: true }); throw error }
  }
  elimina(name: string | null) {
    if (!name || !nomeFileSicuro(name)) return
    // La finestra consente ai backup già iniziati di copiare i file del proprio snapshot.
    this.db.prepare('INSERT INTO file_da_eliminare VALUES (?,?) ON CONFLICT(file) DO UPDATE SET dopo=excluded.dopo').run(name, Date.now() + 48 * 3600000)
  }
}
