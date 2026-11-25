import type { Metadata } from 'next'
import Image from 'next/image'
import { getImpostazioni } from '@/lib/dati'
import { dizionario, type Lang } from '@/lib/dizionario'
import { testoBrand } from '@/lib/branding'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang
  return { title: dizionario(lang).dove.titolo, alternates: { languages: { it: '/dove', en: '/en/dove' } } }
}

export default async function PaginaDove({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const imp = getImpostazioni()
  const nome = imp.nomePub || 'Il nostro pub'
  const q = encodeURIComponent([nome, imp.indirizzo].filter(Boolean).join(', '))
  const indicazioni = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const mappa = `https://www.google.com/maps/search/?api=1&query=${q}`
  const foto = imp.branding.hero

  return <>
    <div className="pub-page-intro pub-container"><h1>{t.dove.titolo}</h1><p>{testoBrand(imp.branding, lang, 'dove.presentazione', imp.indirizzo ? t.dove.testoConIndirizzo(imp.indirizzo) : t.dove.testoSenzaIndirizzo)}</p></div>
    <div className="pub-paper"><div className="pub-container pub-location"><div>
      <dl>
        {imp.indirizzo && <div><dt>{t.dove.indirizzo}</dt><dd>{imp.indirizzo}</dd></div>}
        {imp.orari.length > 0 && <div><dt>{t.dove.orari}</dt><dd>{imp.orari.map((f, i) => <span key={i}>{f.giorni}{f.giorni && f.orario ? ' · ' : ''}{f.orario}</span>)}</dd></div>}
        {imp.telefono && <div><dt>{t.dove.telefono}</dt><dd><a href={`tel:${imp.telefono.replace(/\s/g, '')}`}>{imp.telefono}</a></dd></div>}
      </dl>
      {imp.indirizzo && <a href={indicazioni} target="_blank" rel="noopener noreferrer" className="pub-button">{t.dove.indicazioniGoogle}<span aria-hidden>↗</span></a>}
    </div>
    {foto ? <figure className="pub-location-photo"><Image src={foto} alt={imp.branding.heroAlt || t.home.altSala} width={960} height={720} sizes="(max-width: 859px) 90vw, 45vw" loading="lazy" />{imp.indirizzo && <a href={mappa} target="_blank" rel="noopener noreferrer">{t.dove.vediSuMaps}</a>}</figure> : imp.indirizzo ? <div className="pub-location-note"><h2>{nome}</h2><p>{imp.indirizzo}</p><a className="pub-text-link" href={mappa} target="_blank" rel="noopener noreferrer">{t.dove.vediSuMaps}</a></div> : null}
    </div></div>
  </>
}
