import type { Viewport } from 'next'
import { cinzel, ebGaramond } from '../fonts'
import '../globals.css'

// Un solo tema: dice ai browser di non generare una versione scura (Auto Dark ecc.).
export const viewport: Viewport = { colorScheme: 'only light' }

// Layout radice dell'admin (il pubblico ha il suo in app/[lang]): resta in italiano.
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cinzel.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  )
}
