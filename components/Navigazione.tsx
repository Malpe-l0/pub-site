import Link from 'next/link'
import type { StileSito } from '@/lib/tipi'
import { stemmaDisponibile } from '@/lib/stemma'

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
    <header className="bg-verde">
      <nav
        aria-label="Principale"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-3">
          {stemmaDisponibile() && <img src="/stemma.png" alt="" className="h-10 w-auto" />}
          <span className="font-titoli text-oro text-2xl">{nomePub}</span>
        </Link>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {voci.map((voce) => (
            <li key={voce.href}>
              <Link href={voce.href} className="text-crema hover:text-oro">
                {voce.testo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
