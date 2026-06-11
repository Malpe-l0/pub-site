import type { Metadata } from 'next'
import { getGalleria } from '@/lib/dati'
import { GalleriaFoto } from '@/components/GalleriaFoto'

export const metadata: Metadata = { title: 'Galleria' }

export default async function PaginaGalleria() {
  return (
    <>
      <h1 className="font-titoli text-verde mt-8 mb-6 text-4xl">Galleria</h1>
      <GalleriaFoto foto={getGalleria()} />
    </>
  )
}
