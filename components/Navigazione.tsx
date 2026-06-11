import Link from 'next/link'
import type { StileSito } from '@/lib/tipi'

export function Navigazione({
  nomePub,
  stile,
  mostraGalleria,
  mostraEventi,
}: {
  nomePub: string
  stile: StileSito
  mostraGalleria: boolean
  mostraEventi: boolean
}) {
  // In modalità "pagina unica" i link puntano alle sezioni della home
  // (ancore assolute: funzionano anche da /menu e /galleria, che restano
  // raggiungibili per link diretti e QR code).
  const voci =
    stile === 'onepage'
      ? [
          { href: '/#menu', testo: 'Menu' },
          ...(mostraEventi ? [{ href: '/#eventi', testo: 'Eventi' }] : []),
          ...(mostraGalleria ? [{ href: '/#galleria', testo: 'Galleria' }] : []),
          { href: '/#contatti', testo: 'Contatti' },
        ]
      : [
          { href: '/menu', testo: 'Menu' },
          ...(mostraGalleria ? [{ href: '/galleria', testo: 'Galleria' }] : []),
        ]

  return (
    <header>
      <nav aria-label="Principale">
        <Link href="/">{nomePub}</Link>
        <ul>
          {voci.map((voce) => (
            <li key={voce.href}>
              <Link href={voce.href}>{voce.testo}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
