import type { Metadata } from 'next'
import { getImpostazioni } from '@/lib/dati'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const impostazioni = getImpostazioni()
  const nome = impostazioni.nomePub || 'Il nostro pub'
  return {
    title: { default: nome, template: `%s — ${nome}` },
    description: impostazioni.descrizione || undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
