import { Cinzel, EB_Garamond, Geist, Geist_Mono } from 'next/font/google'

// Sistema pubblico "shadcn": Geist (sans) per testo e titoli, Geist Mono per
// prezzi e numeri. Anche il pannello usa Geist per rendere leggibili i controlli.
export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

// Font del pannello admin (invariati): Cinzel (display) + EB Garamond (testo).
export const cinzel = Cinzel({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
})

export const ebGaramond = EB_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mulish',
})
