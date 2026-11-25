import type { FotoVetrina } from '@/lib/tipi'
import type { Lang } from '@/lib/dizionario'

/** Le immagini dimostrative del vecchio seed non sono fotografie del locale. */
export function fotoDelLocale(foto: FotoVetrina[], legacy?: boolean, lang: Lang = 'it'): FotoVetrina[] {
  if (!legacy) return foto
  const reali = foto.filter((f) => !f.src.startsWith('/uploads/demo-foto-'))
  if (reali.length > 0) return reali
  return [
    { src: '/taproom/foto-bancone.jpg', didascalia: lang === 'it' ? 'Il bancone in legno scuro' : 'The dark wooden bar', href: '' },
    { src: '/taproom/foto-spine.jpg', didascalia: lang === 'it' ? 'Una pinta appena spillata' : 'A freshly poured pint', href: '' },
    { src: '/taproom/foto-sala.jpg', didascalia: lang === 'it' ? 'La sala del pub' : 'Inside the pub', href: '' },
    { src: '/taproom/foto-pinta.jpg', didascalia: lang === 'it' ? 'Al bancone' : 'At the bar', href: '' },
  ]
}
