import type { Metadata } from 'next'
import { getGalleria } from '@/lib/dati'
import { GalleriaFoto } from '@/components/GalleriaFoto'

export const metadata: Metadata = { title: 'Galleria' }

export default async function PaginaGalleria() {
  return (
    <>
      <h1>Galleria</h1>
      <GalleriaFoto foto={getGalleria()} />
    </>
  )
}
