import type { Metadata } from 'next'
import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { esci } from '../azioni'

export const metadata: Metadata = { title: 'Pannello del pub', robots: { index: false } }

export default async function LayoutPannello({ children }: { children: React.ReactNode }) {
  await richiediAdmin()

  return (
    <div className="admin mx-auto max-w-3xl px-4 pb-12">
      <header className="bg-verde -mx-4 mb-4 px-4 py-3">
        <nav aria-label="Pannello" className="flex flex-wrap items-center justify-between gap-2">
          <ul className="text-crema flex list-none flex-wrap gap-x-4 gap-y-1 p-0!">
            <li>
              <Link className="hover:text-oro" href="/admin">
                Pannello
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/menu">
                Menu
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/eventi">
                Eventi
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/galleria">
                Galleria
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/servizi">
                Servizi
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/popup">
                Pop-up
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/classifica">
                Classifica
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/impostazioni">
                Impostazioni
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/" target="_blank">
                Vedi il sito
              </Link>
            </li>
          </ul>
          <form action={esci}>
            {/* Tailwind v4: l'important è col punto esclamativo FINALE */}
            <button className="mt-0! bg-transparent! text-oro! underline">Esci</button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
