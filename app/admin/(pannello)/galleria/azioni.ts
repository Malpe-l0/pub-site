'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { db } from '@/lib/db'
import { salvaFoto, eliminaFoto, fileCaricato } from '@/lib/upload'
import { MAX_FILES } from '@/lib/media'
import { testo, numero } from '@/lib/form'
import { salvaConfigInstagram, salvaConfigGalleria, sincronizzaInstagram } from '@/lib/instagram'

export async function caricaFoto(formData: FormData) {
  const amministratore = await richiediAdmin()
  const file = formData.getAll('foto')
  if (file.length > MAX_FILES) throw new Error('Carica al massimo 5 immagini per volta.')
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
  registraAudit('galleria.caricaFoto', amministratore.id)
  redirect('/admin/galleria')
}

export async function aggiornaFoto(formData: FormData) {
  const amministratore = await richiediAdmin()
  db.prepare('UPDATE foto_galleria SET didascalia = ?, ordine = ? WHERE id = ?').run(
    testo(formData, 'didascalia'),
    numero(formData, 'ordine'),
    numero(formData, 'id')
  )
  registraAudit('galleria.aggiornaFoto', amministratore.id)
  redirect('/admin/galleria')
}

export async function eliminaFotoGalleria(formData: FormData) {
  const amministratore = await richiediAdmin()
  const id = numero(formData, 'id')
  const riga = db.prepare('SELECT file FROM foto_galleria WHERE id = ?').get(id) as
    | { file: string }
    | undefined
  if (riga) {
    await eliminaFoto(riga.file)
    db.prepare('DELETE FROM foto_galleria WHERE id = ?').run(id)
  }
  registraAudit('galleria.eliminaFotoGalleria', amministratore.id)
  redirect('/admin/galleria')
}

export async function configuraInstagram(formData: FormData) {
  const amministratore = await richiediAdmin('owner')
  await salvaConfigInstagram(testo(formData, 'userId'), testo(formData, 'accessToken'))
  registraAudit('galleria.configuraInstagram', amministratore.id)
  redirect('/admin/galleria')
}

export async function sincronizzaOra() {
  const amministratore = await richiediAdmin()
  await sincronizzaInstagram()
  registraAudit('galleria.sincronizzaOra', amministratore.id)
  redirect('/admin/galleria')
}

export async function aggiornaFonte(formData: FormData) {
  const user=await richiediAdmin()
  salvaConfigGalleria(testo(formData,'fonte'), formData.get('includiReel') === 'on')
  registraAudit('galleria.fonte_aggiornata',user.id)
  redirect('/admin/galleria?salvato=1')
}

export async function visibilitaInstagram(formData: FormData) {
  const user=await richiediAdmin()
  db.prepare('UPDATE foto_instagram SET nascosta=? WHERE id=?').run(formData.get('nascosta')==='1'?1:0,numero(formData,'id'))
  registraAudit('galleria.visibilita_instagram',user.id)
  redirect('/admin/galleria?salvato=1')
}
