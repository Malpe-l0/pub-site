import { Cinzel, EB_Garamond } from 'next/font/google'

// Sistema "Black Friar": Cinzel (display, capitali romane) + EB Garamond (testo).
// Condivisi dai due layout radice (pubblico [lang] e admin).
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
