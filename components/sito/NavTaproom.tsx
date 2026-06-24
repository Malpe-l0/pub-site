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
      {/* Scrim morbido in alto: tiene leggibili logo e link su qualsiasi foto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent"
      />
      <nav
        aria-label="Principale"
        className="relative mx-auto flex max-w-[1180px] items-center justify-between px-[clamp(24px,5vw,56px)] py-[20px]"
      >
        <a
          href="/"
          className="font-insegna text-panna text-[1.5rem] leading-none font-bold tracking-[0.005em]"
        >
          {nomePub}
        </a>

        {/* Desktop (≥860px) */}
        <ul className="hidden items-center gap-[clamp(16px,2.4vw,34px)] min-[860px]:flex">
          {VOCI.map((v) => (
            <li key={v.href}>
              <a
                href={v.href}
                className="font-insegna text-panna-2 hover:text-ambra text-[0.95rem] font-medium tracking-[0.01em] transition-colors"
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
          className="bg-espresso-3/95 border-ambra/20 relative flex flex-col border-t px-[clamp(24px,5vw,56px)] py-2 backdrop-blur-sm min-[860px]:hidden"
        >
          {VOCI.map((v) => (
            <li key={v.href}>
              <a
                href={v.href}
                onClick={() => setAperto(false)}
                className="font-insegna text-panna hover:text-ambra flex min-h-[48px] items-center py-3 text-[1.1rem] font-medium tracking-[0.01em]"
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
