'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { testo, dataValida } from '@/lib/form'
import { db } from '@/lib/db'

export async function salvaPopup(formData: FormData) {
  const amministratore = await richiediAdmin()

  const attivo = formData.get('attivo') === 'on' ? 1 : 0
  const titolo = testo(formData, 'titolo')
  const messaggio = testo(formData, 'messaggio')
  const dataInizio = dataValida(testo(formData, 'dataInizio'))
  const dataFine = dataValida(testo(formData, 'dataFine'))

  if (dataInizio && dataFine && dataFine < dataInizio) throw new Error('Intervallo date non valido')

  db.prepare(
    `UPDATE popup
     SET attivo = ?, titolo = ?, messaggio = ?, data_inizio = ?, data_fine = ?
     WHERE id = 1`
  ).run(attivo, titolo, messaggio, dataInizio, dataFine)

  registraAudit('popup.salvaPopup', amministratore.id)
  redirect('/admin/popup?salvato=1')
}
