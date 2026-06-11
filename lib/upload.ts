import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import { UPLOADS_DIR } from './db'

/**
 * Salva una foto caricata dal pannello: ridimensiona (le foto da telefono
 * pesano anche 8 MB), converte in webp e restituisce il nome file generato.
 */
export async function salvaFoto(file: File, larghezzaMax = 1600): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const nome = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`
  await sharp(buffer)
    .rotate() // rispetta l'orientamento EXIF delle foto da telefono
    .resize({ width: larghezzaMax, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(UPLOADS_DIR, nome))
  return nome
}

export async function eliminaFoto(nome: string | null) {
  if (!nome || nome !== path.basename(nome)) return // niente path traversal
  await fs.rm(path.join(UPLOADS_DIR, nome), { force: true })
}

/** True se nel form è stato caricato un file vero (i campi file vuoti arrivano con size 0). */
export function fileCaricato(valore: FormDataEntryValue | null): valore is File {
  return valore instanceof File && valore.size > 0
}
