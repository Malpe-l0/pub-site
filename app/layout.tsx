import type { Metadata } from 'next'
import { Oswald, Mulish, Zilla_Slab } from 'next/font/google'
import { getImpostazioni } from '@/lib/dati'
import './globals.css'

// Direzione "Editoriale": Zilla Slab (insegne/titoli, slab serif in maiuscolo e
// minuscolo) + Mulish (testo corrente). Oswald resta caricato solo per il
// pannello /admin e il gioco, che mantengono la palette araldica.
const zilla = Zilla_Slab({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-zilla',
})

const oswald = Oswald({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
})

const mulish = Mulish({
  weight: ['400', '600'],
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
    <html lang="it" className={`${zilla.variable} ${oswald.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  )
}
