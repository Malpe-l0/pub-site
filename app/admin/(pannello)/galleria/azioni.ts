'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { salvaFoto, eliminaFoto, fileCaricato } from '@/lib/upload'
import { testo, numero } from '@/lib/form'
import { salvaConfigInstagram, sincronizzaInstagram } from '@/lib/instagram'

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
    testo(formData, 'didascalia'),
    numero(formData, 'ordine'),
    numero(formData, 'id')
  )
  redirect('/admin/galleria')
}

export async function eliminaFotoGalleria(formData: FormData) {
  await richiediAdmin()
  const id = numero(formData, 'id')
  const riga = db.prepare('SELECT file FROM foto_galleria WHERE id = ?').get(id) as
    | { file: string }
    | undefined
  if (riga) {
    await eliminaFoto(riga.file)
    db.prepare('DELETE FROM foto_galleria WHERE id = ?').run(id)
  }
  redirect('/admin/galleria')
}

export async function configuraInstagram(formData: FormData) {
  await richiediAdmin()
  salvaConfigInstagram(testo(formData, 'userId'), testo(formData, 'accessToken'))
  redirect('/admin/galleria')
}

export async function sincronizzaOra() {
  await richiediAdmin()
  await sincronizzaInstagram()
  redirect('/admin/galleria')
}
