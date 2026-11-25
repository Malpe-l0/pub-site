import { UPLOADS_DIR, db } from './db.ts'
import { MediaStore, MAX_FILE_BYTES } from './media.ts'
const store = new MediaStore(UPLOADS_DIR, db)
export async function salvaFoto(file: File, larghezzaMax = 1600) {
  if (file.size > MAX_FILE_BYTES) throw new Error('Le immagini devono pesare al massimo 8 MB.')
  return store.salva(Buffer.from(await file.arrayBuffer()), larghezzaMax)
}
export const salvaFotoBuffer = (buffer: Buffer, larghezzaMax = 1600) => store.salva(buffer, larghezzaMax)
export async function eliminaFoto(nome: string | null) { store.elimina(nome) }
export function fileCaricato(valore: FormDataEntryValue | null): valore is File { return valore instanceof File && valore.size > 0 }
export async function fileDaForm(form: FormData, campo: string, width: number, old: string | null) {
  const file = form.get(campo)
  if (fileCaricato(file)) {
    const name = await salvaFoto(file, width)
    await eliminaFoto(old)
    return name
  }
  if (form.get(`rimuovi${campo[0].toUpperCase()}${campo.slice(1)}`) === 'on') {
    await eliminaFoto(old)
    return null
  }
  return old
}
