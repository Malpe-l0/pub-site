'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import type { FasciaOraria } from '@/lib/tipi'

export async function salvaImpostazioni(formData: FormData) {
  await richiediAdmin()

  const campo = (nome: string) => String(formData.get(nome) ?? '').trim()

  const giorni = formData.getAll('giorni').map(String)
  const orariCampo = formData.getAll('orario').map(String)
  const orari: FasciaOraria[] = giorni
    .map((g, i) => ({ giorni: g.trim(), orario: (orariCampo[i] ?? '').trim() }))
    .filter((fascia) => fascia.giorni || fascia.orario)

  const stileSito = formData.get('stileSito') === 'onepage' ? 'onepage' : 'multipagina'

  db.prepare(
    `UPDATE impostazioni
     SET nome_pub = ?, descrizione = ?, indirizzo = ?, telefono = ?,
         email = ?, facebook = ?, instagram = ?, orari = ?, stile_sito = ?
     WHERE id = 1`
  ).run(
    campo('nomePub'),
    campo('descrizione'),
    campo('indirizzo'),
    campo('telefono'),
    campo('email'),
    campo('facebook'),
    campo('instagram'),
    JSON.stringify(orari),
    stileSito
  )

  redirect('/admin/impostazioni?salvato=1')
}
