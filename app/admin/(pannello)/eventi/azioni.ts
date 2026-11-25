'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { db } from '@/lib/db'
import { getEvento } from '@/lib/dati'
import { eliminaFoto, fileDaForm } from '@/lib/upload'
import { testo, numero, dataValida } from '@/lib/form'

export async function creaEvento(formData: FormData) {
  const amministratore = await richiediAdmin()
  const titolo = testo(formData, 'titolo')
  const dataOra = dataValida(testo(formData, 'dataOra'), true)
  if (!titolo || !dataOra) redirect('/admin/eventi')

  const immagine = await fileDaForm(formData, 'immagine', 1200, null)
  db.prepare(
    'INSERT INTO eventi (titolo, data_ora, descrizione, immagine) VALUES (?, ?, ?, ?)'
  ).run(titolo, dataOra, testo(formData, 'descrizione'), immagine)
  registraAudit('eventi.creaEvento', amministratore.id)
  redirect('/admin/eventi')
}

export async function aggiornaEvento(formData: FormData) {
  const amministratore = await richiediAdmin()
  const id = numero(formData, 'id')
  const esistente = getEvento(id)
  const titolo = testo(formData, 'titolo')
  const dataOra = dataValida(testo(formData, 'dataOra'), true)
  if (!esistente || !titolo || !dataOra) redirect('/admin/eventi')

  const immagine = await fileDaForm(formData, 'immagine', 1200, esistente.immagine)
  db.prepare(
    'UPDATE eventi SET titolo = ?, data_ora = ?, descrizione = ?, immagine = ? WHERE id = ?'
  ).run(titolo, dataOra, testo(formData, 'descrizione'), immagine, id)
  registraAudit('eventi.aggiornaEvento', amministratore.id)
  redirect('/admin/eventi')
}

export async function eliminaEvento(formData: FormData) {
  const amministratore = await richiediAdmin()
  const id = numero(formData, 'id')
  const evento = getEvento(id)
  if (evento) {
    await eliminaFoto(evento.immagine)
    db.prepare('DELETE FROM eventi WHERE id = ?').run(id)
  }
  registraAudit('eventi.eliminaEvento', amministratore.id)
  redirect('/admin/eventi')
}
