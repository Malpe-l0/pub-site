import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { testoBrand } from '@/lib/branding'
import { getImpostazioni } from '@/lib/dati'
import { dizionario, haLingua, type Lang } from '@/lib/dizionario'
import { cinzel, ebGaramond, geistMono, geistSans } from '../fonts'
import '../globals.css'

// Un solo tema: dice ai browser di non generare una versione scura (Auto Dark ecc.).
export const viewport: Viewport = { colorScheme: 'only light' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!haLingua(lang)) return {}
  const impostazioni = getImpostazioni()
  const nome = impostazioni.nomePub || 'Il nostro pub'
  // La descrizione dal pannello è in italiano; in inglese si usa il testo fisso.
  const descrizione =
    testoBrand(impostazioni.branding, lang, 'home.raccontoDefault', lang === 'it' ? impostazioni.descrizione : dizionario(lang).home.raccontoDefault)
  return {
    title: { default: nome, template: `%s — ${nome}` },
    description: descrizione,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!haLingua(lang)) notFound()
  return (
    <html
      lang={lang satisfies Lang}
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${ebGaramond.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
