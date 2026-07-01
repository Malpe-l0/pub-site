import type { Metadata } from 'next'
import { Cinzel, EB_Garamond } from 'next/font/google'
import { getImpostazioni } from '@/lib/dati'
import './globals.css'

// Sistema "Black Friar": Cinzel (display, capitali romane) + EB Garamond (testo).
const cinzel = Cinzel({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
})

const ebGaramond = EB_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mulish',
})

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
    <html lang="it" className={`${cinzel.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  )
}
