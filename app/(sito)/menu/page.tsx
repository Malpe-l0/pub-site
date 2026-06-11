import type { Metadata } from 'next'
import { getMenuPubblico } from '@/lib/dati'
import { ListaMenu } from '@/components/ListaMenu'

export const metadata: Metadata = { title: 'Menu' }

export default async function PaginaMenu() {
  return (
    <>
      <h1 className="font-titoli text-verde mt-8 mb-6 text-4xl">Menu</h1>
      <ListaMenu categorie={getMenuPubblico()} />
    </>
  )
}
