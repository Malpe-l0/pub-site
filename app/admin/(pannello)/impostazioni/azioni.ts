'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { db } from '@/lib/db'
import { testo, urlSicuro } from '@/lib/form'
import type { FasciaOraria } from '@/lib/tipi'

export async function salvaImpostazioni(formData: FormData) {
  const user = await richiediAdmin('owner')

  const campo = (nome: string) => testo(formData, nome, 5000)
  if (!campo('nomePub') || campo('nomePub').length > 120) throw new Error('Nome non valido')
  if (campo('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo('email'))) throw new Error('Email non valida')
  if (campo('telefono') && !/^[+0-9() .-]{3,40}$/.test(campo('telefono'))) throw new Error('Telefono non valido')

  const giorni = formData.getAll('giorni').map(String)
  const orariCampo = formData.getAll('orario').map(String)
  if (giorni.length > 14 || giorni.some(g => g.length > 100) || orariCampo.some(o => o.length > 100)) throw new Error('Orari non validi')
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
    urlSicuro(campo('facebook')),
    urlSicuro(campo('instagram')),
    JSON.stringify(orari),
    stileSito
  )

  registraAudit('sito.impostazioni_aggiornate', user.id)
  redirect('/admin/impostazioni?salvato=1')
}
