'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { percorso, type Dizionario, type Lang } from '@/lib/dizionario'

/** Barra di navigazione: trasparente sull'hero home; solida altrove. */
export function NavTaproom({
  nomePub,
  lang,
  t,
}: {
  nomePub: string
  lang: Lang
  t: Dizionario['nav']
}) {
  const pathname = usePathname()
  const suHome = pathname === '/' || pathname === '/en'
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

  // Birre resta ancora home; Menu e Dove siamo sono pagine dedicate.
  const voci = [
    { href: percorso(lang, '/#birre'), testo: t.birre },
    { href: percorso(lang, '/menu'), testo: t.menu },
    { href: percorso(lang, '/dove'), testo: t.dove },
  ]
  const hrefMenu = percorso(lang, '/menu')

  // Toggle lingua: cookie letto dal proxy + navigazione all'URL equivalente.
  const altra: Lang = lang === 'it' ? 'en' : 'it'
  const cambiaLingua = () => {
    document.cookie = `lingua=${altra};path=/;max-age=31536000`
    const senzaPrefisso = lang === 'en' ? pathname.replace(/^\/en/, '') || '/' : pathname
    window.location.href = percorso(altra, senzaPrefisso)
  }
  const toggle = (
    <button
      type="button"
      onClick={cambiaLingua}
      aria-label={t.cambiaLingua}
      title={t.cambiaLingua}
      className="text-panna hover:text-ambra-ink border-panna/35 hover:border-panna/70 cursor-pointer border px-[10px] py-[5px] text-[0.72rem] tracking-[0.2em] uppercase transition-colors"
    >
      {t.linguaBreve}
    </button>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        fissa
          ? 'bg-espresso/95 border-ambra/20 border-b backdrop-blur-sm'
          : 'bg-gradient-to-b from-black/40 to-transparent'
      }`}
    >
      <nav
        aria-label={t.principale}
        className={`mx-auto flex max-w-[1180px] items-center justify-between px-[clamp(20px,4vw,52px)] transition-[padding] duration-300 ${
          fissa ? 'py-3' : 'py-5'
        }`}
      >
        <a href={percorso(lang, '/')} className="flex items-center gap-[12px]">
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
          {voci.map((v) => {
            const qui = v.href === hrefMenu && pathname === hrefMenu
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
          <li>{toggle}</li>
        </ul>

        {/* Mobile (<860px) */}
        <div className="flex items-center gap-2 min-[860px]:hidden">
          {toggle}
          <button
            type="button"
            onClick={() => setAperto((a) => !a)}
            aria-expanded={aperto}
            aria-controls="menu-mobile"
            aria-label={aperto ? t.chiudiMenu : t.apriMenu}
            className="text-panna flex h-11 w-11 items-center justify-center"
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
        </div>
      </nav>

      {aperto && (
        <ul
          id="menu-mobile"
          className="bg-espresso-3/95 border-ambra/20 flex flex-col border-t px-[clamp(24px,5vw,56px)] py-2 backdrop-blur-sm min-[860px]:hidden"
        >
          {voci.map((v) => (
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
