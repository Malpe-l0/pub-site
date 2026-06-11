import type { Metadata } from 'next'
import { IM_Fell_English, Lora } from 'next/font/google'
import { getImpostazioni } from '@/lib/dati'
import './globals.css'

const imFell = IM_Fell_English({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-im-fell',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
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
    <html lang="it" className={`${imFell.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
