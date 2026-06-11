import type { Metadata } from 'next'
import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { esci } from '../azioni'

export const metadata: Metadata = { title: 'Pannello del pub', robots: { index: false } }

export default async function LayoutPannello({ children }: { children: React.ReactNode }) {
  await richiediAdmin()

  return (
    <>
      <header>
        <nav aria-label="Pannello">
          <ul>
            <li>
              <Link href="/admin">Pannello</Link>
            </li>
            <li>
              <Link href="/admin/menu">Menu</Link>
            </li>
            <li>
              <Link href="/admin/eventi">Eventi</Link>
            </li>
            <li>
              <Link href="/admin/galleria">Galleria</Link>
            </li>
            <li>
              <Link href="/admin/servizi">Servizi</Link>
            </li>
            <li>
              <Link href="/admin/popup">Pop-up</Link>
            </li>
            <li>
              <Link href="/admin/impostazioni">Impostazioni</Link>
            </li>
            <li>
              <Link href="/" target="_blank">
                Vedi il sito
              </Link>
            </li>
          </ul>
          <form action={esci}>
            <button>Esci</button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}
