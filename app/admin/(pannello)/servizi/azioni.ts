'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServizio } from '@/lib/dati'
import { salvaFoto, eliminaFoto, fileCaricato } from '@/lib/upload'
import { testo, numero } from '@/lib/form'

export async function creaServizio(formData: FormData) {
  await richiediAdmin()
  const nome = testo(formData, 'nome')
  if (!nome) redirect('/admin/servizi')

  const file = formData.get('logo')
  const logo = fileCaricato(file) ? await salvaFoto(file, 400) : null
  db.prepare('INSERT INTO servizi (nome, logo, ordine, attivo) VALUES (?, ?, ?, 1)').run(
    nome,
    logo,
    numero(formData, 'ordine')
  )
  redirect('/admin/servizi')
}

export async function aggiornaServizio(formData: FormData) {
  await richiediAdmin()
  const id = numero(formData, 'id')
  const esistente = getServizio(id)
  const nome = testo(formData, 'nome')
  if (!esistente || !nome) redirect('/admin/servizi')

  let logo = esistente.logo
  const file = formData.get('logo')
  if (fileCaricato(file)) {
    await eliminaFoto(esistente.logo)
    logo = await salvaFoto(file, 400)
  }

  db.prepare('UPDATE servizi SET nome = ?, logo = ?, ordine = ? WHERE id = ?').run(
    nome,
    logo,
    numero(formData, 'ordine'),
    id
  )
  redirect('/admin/servizi')
}

export async function impostaAttivo(formData: FormData) {
  await richiediAdmin()
  db.prepare('UPDATE servizi SET attivo = ? WHERE id = ?').run(
    formData.get('attivo') === '1' ? 1 : 0,
    numero(formData, 'id')
  )
  redirect('/admin/servizi')
}

export async function eliminaServizio(formData: FormData) {
  await richiediAdmin()
  const id = numero(formData, 'id')
  const servizio = getServizio(id)
  if (servizio) {
    await eliminaFoto(servizio.logo)
    db.prepare('DELETE FROM servizi WHERE id = ?').run(id)
  }
  redirect('/admin/servizi')
}
