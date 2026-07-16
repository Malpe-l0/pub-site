import { Besley, Cinzel, EB_Garamond } from 'next/font/google'

// Sistema "Black Friar": Cinzel (display, capitali romane) + EB Garamond (testo).
// Direzione "Muro di targhe": Besley (revival Clarendon) per gli elementi che
// citano le insegne smaltate d'epoca — slogan, targhe birre, prezzi.
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

export const besley = Besley({
  weight: ['500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-besley',
})
