import type { Metadata } from 'next'
import { getMenuPubblico } from '@/lib/dati'
import { ListaMenu } from '@/components/ListaMenu'

export const metadata: Metadata = { title: 'Menu' }

export default async function PaginaMenu() {
  return (
    <>
      <h1>Menu</h1>
      <ListaMenu categorie={getMenuPubblico()} />
    </>
  )
}
