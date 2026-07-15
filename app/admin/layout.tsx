import { cinzel, ebGaramond } from '../fonts'
import '../globals.css'

// Layout radice dell'admin (il pubblico ha il suo in app/[lang]): resta in italiano.
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cinzel.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  )
}
