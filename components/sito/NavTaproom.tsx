'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { percorso, type Dizionario, type Lang } from '@/lib/dizionario'

export function NavTaproom({
  logo, birre = true, onepage = false, galleria, nomePub, lang, t, sottotitolo,
}: {
  logo?: string
  birre?: boolean
  onepage?: boolean
  galleria?: string
  nomePub: string
  lang: Lang
  t: Dizionario['nav']
  sottotitolo?: string
}) {
  const pathname = usePathname().replace(/^\/(it|en)(?=\/|$)/, '') || '/'
  const [aperto, setAperto] = useState(false)
  const pulsante = useRef<HTMLButtonElement>(null)
  const voci = [
    ...(birre ? [{ href: percorso(lang, '/#birre'), testo: t.birre }] : []),
    { href: percorso(lang, onepage ? '/#menu' : '/menu'), testo: t.menu },
    ...(galleria ? [{ href: percorso(lang, '/galleria'), testo: galleria }] : []),
    { href: percorso(lang, '/dove'), testo: t.dove },
  ]
  const toggle = (
    <a href={`?lingua=${lang === 'it' ? 'en' : 'it'}`} className="pub-language" aria-label={t.cambiaLingua} title={t.cambiaLingua}>
      {t.linguaBreve}
    </a>
  )

  return (
    <header className="pub-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && aperto) {
        setAperto(false)
        pulsante.current?.focus()
      }
    }}>
      <nav className="pub-nav pub-container" aria-label={t.principale}>
        <a href={percorso(lang, '/')} className="pub-wordmark">
          {logo && <Image src={logo} alt="" width={48} height={48} className="pub-logo" />}
          <span><span className="pub-wordmark-name">{nomePub}</span>{sottotitolo && <span className="pub-wordmark-note">{sottotitolo}</span>}</span>
        </a>
        <ul className="pub-nav-desktop">
          {voci.map((v) => (
            <li key={v.href}><a href={v.href} aria-current={!v.href.includes('#') && pathname === v.href.replace(/^\/en(?=\/|$)/, '') ? 'page' : undefined}>{v.testo}</a></li>
          ))}
          <li>{toggle}</li>
        </ul>
        <div className="pub-nav-mobile-controls">
          {toggle}
          <button ref={pulsante} type="button" onClick={() => setAperto(!aperto)} aria-expanded={aperto} aria-controls="menu-mobile" aria-label={aperto ? t.chiudiMenu : t.apriMenu} className="pub-menu-toggle">
            {aperto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </nav>
      {aperto && <ul id="menu-mobile" className="pub-nav-mobile">
        {voci.map((v) => <li key={v.href}><a href={v.href} onClick={() => setAperto(false)}>{v.testo}</a></li>)}
      </ul>}
    </header>
  )
}
