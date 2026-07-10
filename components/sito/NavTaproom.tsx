'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Birre/Dove restano ancore home; Menu è la carta intera su /menu.
const VOCI = [
  { href: '/#birre', testo: 'Birre' },
  { href: '/menu', testo: 'Menu' },
  { href: '/#dove', testo: 'Dove siamo' },
]

/** Barra di navigazione: trasparente sull'hero home; solida altrove. */
export function NavTaproom({ nomePub }: { nomePub: string }) {
  const pathname = usePathname()
  const suHome = pathname === '/'
  const [aperto, setAperto] = useState(false)
  // Dopo l'hero la nav diventa solida e resta in alto: su un sito di servizio
  // l'accesso a Menu/Dove non deve sparire allo scroll. ponytail: scroll passivo.
  const [scrollato, setScrollato] = useState(false)
  useEffect(() => {
    if (!suHome) return
    const onScroll = () => setScrollato(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [suHome])
  const fissa = !suHome || scrollato

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        fissa
          ? 'bg-espresso/95 border-ambra/20 border-b backdrop-blur-sm'
          : 'bg-gradient-to-b from-black/40 to-transparent'
      }`}
    >
      <nav
        aria-label="Principale"
        className={`mx-auto flex max-w-[1180px] items-center justify-between px-[clamp(20px,4vw,52px)] transition-[padding] duration-300 ${
          fissa ? 'py-3' : 'py-5'
        }`}
      >
        <a href="/" className="flex items-center gap-[12px]">
          <img
            src="/taproom/crest.png"
            alt=""
            aria-hidden
            className={`w-auto transition-[height] duration-300 ${fissa ? 'h-11' : 'h-14'}`}
          />
          <span className="font-titoli text-panna text-[clamp(1.2rem,2.6vw,1.7rem)] tracking-[0.02em]">
            {nomePub}
          </span>
        </a>

        {/* Desktop (≥860px) */}
        <ul className="hidden items-center gap-[clamp(16px,2.4vw,32px)] min-[860px]:flex">
          {VOCI.map((v) => {
            const qui = v.href === '/menu' && pathname === '/menu'
            return (
              <li key={v.href}>
                <a
                  href={v.href}
                  aria-current={qui ? 'page' : undefined}
                  className={`inline-block py-2 text-[0.76rem] tracking-[0.2em] uppercase transition-colors ${
                    qui ? 'text-ambra-ink' : 'text-panna hover:text-ambra-ink'
                  }`}
                >
                  {v.testo}
                </a>
              </li>
            )
          })}
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
