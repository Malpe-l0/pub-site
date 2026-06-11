'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function salvaPopup(formData: FormData) {
  await richiediAdmin()

  const attivo = formData.get('attivo') === 'on' ? 1 : 0
  const titolo = String(formData.get('titolo') ?? '').trim()
  const messaggio = String(formData.get('messaggio') ?? '').trim()
  const dataInizio = String(formData.get('dataInizio') ?? '') || null
  const dataFine = String(formData.get('dataFine') ?? '') || null

  db.prepare(
    `UPDATE popup
     SET attivo = ?, titolo = ?, messaggio = ?, data_inizio = ?, data_fine = ?
     WHERE id = 1`
  ).run(attivo, titolo, messaggio, dataInizio, dataFine)

  redirect('/admin/popup?salvato=1')
}
