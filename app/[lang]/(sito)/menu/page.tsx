import type { Metadata } from 'next'
import Image from 'next/image'
import { getImpostazioni, getMenuPubblico } from '@/lib/dati'
import { dizionario, type Lang } from '@/lib/dizionario'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang
  return { title: dizionario(lang).nav.menu, alternates: { languages: { it: '/menu', en: '/en/menu' } } }
}

export default async function PaginaMenu({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const imp = getImpostazioni()
  const contatto = imp.telefono ? { href: `tel:${imp.telefono.replace(/\s/g, '')}`, testo: t.menu.chiama } : imp.instagram ? { href: imp.instagram, testo: t.menu.chiedi } : null
  const euro = new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'EUR' })

  return <>
    <div className="pub-page-intro pub-container"><h1>{t.menu.titolo}</h1><p>{t.home.menuBlurb}</p></div>
    <div className="pub-paper pub-menu-page">
      {categorie.length === 0 ? <div className="pub-container pub-empty"><p>{t.menu.inAggiornamento}</p>{contatto && <a href={contatto.href} className="pub-button">{contatto.testo}</a>}</div> : <>
        <nav className="pub-category-index pub-container" aria-label={lang === 'it' ? 'Categorie del menu' : 'Menu categories'}>{categorie.map((cat) => <a key={cat.id} href={`#cat-${cat.id}`}>{cat.nome}</a>)}</nav>
        <div className="pub-printed-menu">{categorie.map((cat) => <section key={cat.id} id={`cat-${cat.id}`} aria-labelledby={`titolo-cat-${cat.id}`} className="pub-full-category">
          <h2 id={`titolo-cat-${cat.id}`}>{cat.nome}</h2>
          <ul>{cat.voci.map((v) => <li key={v.id} className="pub-menu-item"><div className="pub-menu-item-copy"><div className="pub-menu-item-top"><h3>{v.nome}</h3><span aria-hidden className="pub-menu-dots" /><span className="pub-price">{euro.format(v.prezzoCentesimi / 100)}</span></div>{v.descrizione && <p>{v.descrizione}</p>}</div>{v.foto && <Image src={`/uploads/${v.foto}`} alt={v.nome} width={72} height={72} loading="lazy" className="pub-menu-thumb" />}</li>)}</ul>
        </section>)}</div>
      </>}
    </div>
  </>
}
