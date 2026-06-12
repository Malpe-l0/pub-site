'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function eliminaPunteggio(formData: FormData) {
  await richiediAdmin()
  const id = Number(formData.get('id'))
  db.prepare('DELETE FROM punteggi WHERE id = ?').run(id)
  redirect('/admin/classifica')
}

export async function svuotaClassifica() {
  await richiediAdmin()
  db.prepare('DELETE FROM punteggi').run()
  redirect('/admin/classifica')
}
