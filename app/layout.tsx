import type { Metadata } from 'next'
import { Oswald, Mulish } from 'next/font/google'
import { getImpostazioni } from '@/lib/dati'
import './globals.css'

// Sistema "Taproom": Oswald (display/UI, condensato) + Mulish (testo corrente).
const oswald = Oswald({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
})

const mulish = Mulish({
  weight: ['400'],
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
    <html lang="it" className={`${oswald.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  )
}
