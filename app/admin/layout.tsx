import type { Viewport } from 'next'
import { geistSans } from '../fonts'
import '../globals.css'
import './admin.css'

// Un solo tema: dice ai browser di non generare una versione scura (Auto Dark ecc.).
export const viewport: Viewport = { colorScheme: 'only light' }

// Layout radice dell'admin (il pubblico ha il suo in app/[lang]): resta in italiano.
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={geistSans.variable}>
      <body className="admin-body">{children}</body>
    </html>
  )
}
