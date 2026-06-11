'use server'

import { redirect } from 'next/navigation'
import { distruggiSessione } from '@/lib/auth'

export async function esci() {
  await distruggiSessione()
  redirect('/admin/login')
}
