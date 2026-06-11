'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { getEvento } from '@/lib/dati'
import { salvaFoto, eliminaFoto, fileCaricato } from '@/lib/upload'

async function immagineDaForm(formData: FormData, esistente: string | null) {
  const file = formData.get('immagine')
  if (fileCaricato(file)) {
    await eliminaFoto(esistente)
    return salvaFoto(file, 1200)
  }
  if (formData.get('rimuoviImmagine') === 'on') {
    await eliminaFoto(esistente)
    return null
  }
  return esistente
}

export async function creaEvento(formData: FormData) {
  await richiediAdmin()
  const titolo = String(formData.get('titolo') ?? '').trim()
  const dataOra = String(formData.get('dataOra') ?? '')
  if (!titolo || !dataOra) redirect('/admin/eventi')

  const immagine = await immagineDaForm(formData, null)
  db.prepare(
    'INSERT INTO eventi (titolo, data_ora, descrizione, immagine) VALUES (?, ?, ?, ?)'
  ).run(titolo, dataOra, String(formData.get('descrizione') ?? '').trim(), immagine)
  redirect('/admin/eventi')
}

export async function aggiornaEvento(formData: FormData) {
  await richiediAdmin()
  const id = Number(formData.get('id'))
  const esistente = getEvento(id)
  const titolo = String(formData.get('titolo') ?? '').trim()
  const dataOra = String(formData.get('dataOra') ?? '')
  if (!esistente || !titolo || !dataOra) redirect('/admin/eventi')

  const immagine = await immagineDaForm(formData, esistente.immagine)
  db.prepare(
    'UPDATE eventi SET titolo = ?, data_ora = ?, descrizione = ?, immagine = ? WHERE id = ?'
  ).run(titolo, dataOra, String(formData.get('descrizione') ?? '').trim(), immagine, id)
  redirect('/admin/eventi')
}

export async function eliminaEvento(formData: FormData) {
  await richiediAdmin()
  const id = Number(formData.get('id'))
  const evento = getEvento(id)
  if (evento) {
    await eliminaFoto(evento.immagine)
    db.prepare('DELETE FROM eventi WHERE id = ?').run(id)
  }
  redirect('/admin/eventi')
}
