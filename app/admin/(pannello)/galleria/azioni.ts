'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { salvaFoto, eliminaFoto, fileCaricato } from '@/lib/upload'

export async function caricaFoto(formData: FormData) {
  await richiediAdmin()
  const file = formData.getAll('foto')
  const base = (db.prepare('SELECT COALESCE(MAX(ordine), -1) AS massimo FROM foto_galleria').get() as {
    massimo: number
  }).massimo

  let posizione = base + 1
  for (const f of file) {
    if (!fileCaricato(f)) continue
    const nome = await salvaFoto(f, 1600)
    db.prepare('INSERT INTO foto_galleria (file, didascalia, ordine) VALUES (?, ?, ?)').run(
      nome,
      '',
      posizione++
    )
  }
  redirect('/admin/galleria')
}

export async function aggiornaFoto(formData: FormData) {
  await richiediAdmin()
  db.prepare('UPDATE foto_galleria SET didascalia = ?, ordine = ? WHERE id = ?').run(
    String(formData.get('didascalia') ?? '').trim(),
    Number(formData.get('ordine')) || 0,
    Number(formData.get('id'))
  )
  redirect('/admin/galleria')
}

export async function eliminaFotoGalleria(formData: FormData) {
  await richiediAdmin()
  const id = Number(formData.get('id'))
  const riga = db.prepare('SELECT file FROM foto_galleria WHERE id = ?').get(id) as
    | { file: string }
    | undefined
  if (riga) {
    await eliminaFoto(riga.file)
    db.prepare('DELETE FROM foto_galleria WHERE id = ?').run(id)
  }
  redirect('/admin/galleria')
}
