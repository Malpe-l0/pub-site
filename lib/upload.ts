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

  // Gli SVG (es. loghi ufficiali dei servizi) restano vettoriali: salvarli
  // com'è li tiene nitidi a ogni dimensione invece di rasterizzarli.
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    const nomeSvg = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.svg`
    await fs.writeFile(path.join(UPLOADS_DIR, nomeSvg), buffer)
    return nomeSvg
  }

  return salvaFotoBuffer(buffer, larghezzaMax)
}

/** Ridimensiona un buffer immagine in webp e lo salva (pipeline condivisa: upload del pannello e foto Instagram). */
export async function salvaFotoBuffer(buffer: Buffer, larghezzaMax = 1600): Promise<string> {
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

/**
 * Risolve il file di un campo form: nuovo caricamento (rimpiazza e ridimensiona),
 * rimozione (checkbox `rimuovi<Campo>`), oppure invariato.
 */
export async function fileDaForm(
  formData: FormData,
  campo: string,
  larghezza: number,
  esistente: string | null
): Promise<string | null> {
  const file = formData.get(campo)
  if (fileCaricato(file)) {
    await eliminaFoto(esistente)
    return salvaFoto(file, larghezza)
  }
  const flag = `rimuovi${campo[0].toUpperCase()}${campo.slice(1)}` // foto→rimuoviFoto
  if (formData.get(flag) === 'on') {
    await eliminaFoto(esistente)
    return null
  }
  return esistente
}
