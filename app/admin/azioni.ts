'use server'

import { redirect } from 'next/navigation'
import { distruggiSessione, utenteCorrente, registraAudit } from '@/lib/auth'

export async function esci() {
  const user = await utenteCorrente()
  if (user) registraAudit('login.uscita', user.id)
  await distruggiSessione()
  redirect('/admin/login')
}
