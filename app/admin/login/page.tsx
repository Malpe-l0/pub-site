import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { sessioneValida } from '@/lib/auth'
import { accedi } from './azioni'

export const metadata: Metadata = { title: 'Accesso pannello', robots: { index: false } }

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ errore?: string }>
}) {
  if (await sessioneValida()) redirect('/admin')
  const { errore } = await searchParams

  return (
    <main>
      <h1>Pannello del pub</h1>
      {errore && <p role="alert">Password sbagliata, riprova.</p>}
      <form action={accedi}>
        <label>
          Password
          <input type="password" name="password" required autoFocus />
        </label>
        <button>Entra</button>
      </form>
    </main>
  )
}
