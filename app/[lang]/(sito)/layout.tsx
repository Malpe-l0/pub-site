import type { CSSProperties } from 'react'
import { getImpostazioni, getPopup } from '@/lib/dati'
import { popupDaMostrare } from '@/lib/popup'
import { dizionario, percorso, type Lang } from '@/lib/dizionario'
import { NavTaproom } from '@/components/sito/NavTaproom'
import { Popup } from '@/components/Popup'
import { testoBrand, coloreTesto } from '@/lib/branding'
import './pub.css'

export const dynamic = 'force-dynamic'

export default async function LayoutSito({ children, params }: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const imp = getImpostazioni()
  const avviso = popupDaMostrare(getPopup())
  const brand = imp.branding
  const copia = (key: string, fallback: string) => testoBrand(brand, lang, key, fallback)
  const nome = imp.nomePub || 'Il nostro pub'
  const accent = brand.legacy ? '#d4b16b' : brand.colore
  const serif = brand.legacy || brand.font === 'serif'
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([nome, imp.indirizzo].filter(Boolean).join(' '))}`

  return (
    <div className="sito-taproom pub-site" style={{
      '--pub-action': accent,
      '--pub-action-ink': coloreTesto(accent),
      '--pub-body-font': serif ? 'var(--font-testo), Georgia, serif' : 'var(--font-sans)',
      '--pub-heading-font': serif ? 'var(--font-titoli), Georgia, serif' : 'var(--font-sans)',
    } as CSSProperties}>
      <a href="#contenuto" className="pub-skip">{lang === 'it' ? 'Vai al contenuto' : 'Skip to content'}</a>
      <NavTaproom nomePub={nome} lang={lang} t={t.nav} logo={brand.logo} sottotitolo={brand.legacy ? t.home.kicker : undefined} birre={brand.sezioni.birre && brand.birre.length > 0} galleria={brand.sezioni.galleria ? t.footer.galleria : undefined} onepage={imp.stileSito === 'onepage' && brand.sezioni.menu} />
      <main id="contenuto" className="pub-main">{children}</main>
      <footer id="dove" className="pub-footer">
        <div className="pub-container">
          <div className="pub-footer-sign"><p className="pub-footer-name">{nome}</p><p className="pub-footer-slogan">{copia('footer.slogan', t.footer.slogan)}</p></div>
          <div className="pub-footer-columns">
            {(imp.indirizzo || imp.orari.length > 0) && <div>
              <h2>{t.nav.dove}</h2>
              {imp.indirizzo && <p>{imp.indirizzo}</p>}
              {imp.orari.length > 0 && <ul className="pub-hours">{imp.orari.map((f, i) => <li key={i}><span>{f.giorni}</span><span>{f.orario}</span></li>)}</ul>}
              {imp.indirizzo && <a href={maps} target="_blank" rel="noopener noreferrer" className="pub-text-link">{t.footer.indicazioniMaps}<span aria-hidden>↗</span></a>}
            </div>}
            {(imp.telefono || imp.email || imp.instagram || imp.facebook) && <div>
              <h2>{t.footer.contatti}</h2>
              <ul className="pub-footer-links">
                {imp.telefono && <li><a href={`tel:${imp.telefono.replace(/\s/g, '')}`}>{imp.telefono}</a></li>}
                {imp.email && <li><a href={`mailto:${imp.email}`}>{imp.email}</a></li>}
                {imp.instagram && <li><a href={imp.instagram} target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden>↗</span></a></li>}
                {imp.facebook && <li><a href={imp.facebook} target="_blank" rel="noopener noreferrer">Facebook <span aria-hidden>↗</span></a></li>}
              </ul>
            </div>}
            <div><h2>{t.footer.esplora}</h2><ul className="pub-footer-links">
              <li><a href={percorso(lang, '/menu')}>{t.nav.menu}</a></li>
              {brand.sezioni.birre && brand.birre.length > 0 && <li><a href={percorso(lang, '/#birre')}>{t.nav.birre}</a></li>}
              {brand.sezioni.galleria && <li><a href={percorso(lang, '/galleria')}>{t.footer.galleria}</a></li>}
              <li><a href={percorso(lang, '/dove')}>{t.nav.dove}</a></li>
            </ul></div>
          </div>
          <div className="pub-colophon"><p>© {new Date().getFullYear()} {nome}{brand.legacy && ' · British Pub · Imola'}</p>{copia('footer.nota', '') && <p>{copia('footer.nota', '')}</p>}</div>
        </div>
      </footer>
      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} testoChiudi={t.popup.chiudi} />}
    </div>
  )
}
