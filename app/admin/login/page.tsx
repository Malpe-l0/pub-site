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
    <main className="admin admin-login">
      <h1>Accedi alla gestione del sito</h1>
      <p>Menu, foto e informazioni del tuo locale.</p>
      {errore && <p role="alert">{errore === 'limite' ? 'Troppi tentativi. Riprova fra 15 minuti.' : 'Nome utente o password non corretti.'}</p>}
      <form action={accedi}>
        <label>
          Nome utente
          <input name="username" autoComplete="username" defaultValue="admin" required maxLength={64} />
        </label>
        <label>
          Password
          <input type="password" name="password" required autoComplete="current-password" maxLength={128} />
        </label>
        <button>Entra</button>
      </form>
      <p>Accesso perso? Il titolare può reimpostare il tuo account. Per recuperare il primo account contatta chi gestisce il sito.</p>
    </main>
  )
}
