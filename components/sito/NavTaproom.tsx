'use client'

import { useState } from 'react'

// Ancore assolute alla home: funzionano anche da /menu, /galleria, /gioco.
const VOCI = [
  { href: '/#birre', testo: 'Birre' },
  { href: '/#menu', testo: 'Menu' },
  { href: '/#sport', testo: 'Sport' },
  { href: '/#dove', testo: 'Dove siamo' },
]

/** Barra di navigazione: trasparente, sovrapposta all'hero. Hamburger sotto 860px. */
export function NavTaproom({ nomePub }: { nomePub: string }) {
  const [aperto, setAperto] = useState(false)

  return (
    <header className="isola-notte absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Principale"
        className="mx-auto flex max-w-[1180px] items-center justify-between px-[clamp(24px,5vw,56px)] py-[22px]"
      >
        <a
          href="/"
          className="font-titoli text-panna text-[1.35rem] font-bold tracking-[0.06em] uppercase"
        >
          {nomePub}
        </a>

        {/* Desktop (≥860px) */}
        <ul className="hidden items-center gap-[clamp(14px,2.4vw,34px)] min-[860px]:flex">
          {VOCI.map((v) => (
            <li key={v.href}>
              <a
                href={v.href}
                className="font-titoli text-panna-3 hover:text-ambra text-[0.82rem] font-normal tracking-[0.14em] uppercase transition-colors"
              >
                {v.testo}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile (<860px) */}
        <button
          type="button"
          onClick={() => setAperto((a) => !a)}
          aria-expanded={aperto}
          aria-controls="menu-mobile"
          aria-label={aperto ? 'Chiudi menu' : 'Apri menu'}
          className="text-panna flex h-11 w-11 items-center justify-center min-[860px]:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {aperto ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {aperto && (
        <ul
          id="menu-mobile"
          className="bg-espresso-3/95 border-ambra/20 flex flex-col border-t px-[clamp(24px,5vw,56px)] py-2 backdrop-blur-sm min-[860px]:hidden"
        >
          {VOCI.map((v) => (
            <li key={v.href}>
              <a
                href={v.href}
                onClick={() => setAperto(false)}
                className="font-titoli text-panna hover:text-ambra flex min-h-[44px] items-center py-3 text-[0.95rem] tracking-[0.14em] uppercase"
              >
                {v.testo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
