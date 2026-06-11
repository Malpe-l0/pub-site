'use server'

import { redirect } from 'next/navigation'
import { verificaPassword, creaSessione } from '@/lib/auth'

export async function accedi(formData: FormData) {
  const password = String(formData.get('password') ?? '')

  if (!verificaPassword(password)) {
    // Piccolo freno ai tentativi a raffica.
    await new Promise((resolve) => setTimeout(resolve, 800))
    redirect('/admin/login?errore=1')
  }

  await creaSessione()
  redirect('/admin')
}
