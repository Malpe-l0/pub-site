'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { salvaConfigInstagram, sincronizzaInstagram } from '@/lib/instagram'

export async function salvaInstagram(formData: FormData) {
  await richiediAdmin()
  const token = String(formData.get('token') ?? '').trim()
  const attivo = formData.get('attivo') === 'on'
  salvaConfigInstagram(token, attivo)
  redirect('/admin/instagram?salvato=1')
}

export async function aggiornaInstagram() {
  await richiediAdmin()
  const esito = await sincronizzaInstagram()
  redirect(`/admin/instagram?sync=${esito.ok ? 'ok' : 'errore'}`)
}
