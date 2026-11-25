import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, MapPin, Phone } from 'lucide-react'
import { getImpostazioni, getMenuPubblico, getGalleriaPubblica, getEventiFuturi, getServiziAttivi } from '@/lib/dati'
import { dizionario, percorso, type Lang } from '@/lib/dizionario'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { CartaMenu } from '@/components/sito/CartaMenu'
import { fotoDelLocale } from '@/components/sito/foto'
import { testoBrand } from '@/lib/branding'

export const metadata: Metadata = { alternates: { languages: { it: '/', en: '/en' } } }

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const imp = getImpostazioni()
  const brand = imp.branding
  const copia = (key: string, fallback: string) => testoBrand(brand, lang, key, fallback)
  const nome = imp.nomePub || 'Il nostro pub'
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const foto = fotoDelLocale(getGalleriaPubblica().foto, brand.legacy, lang).slice(0, 3)
  const eventi = brand.sezioni.eventi ? getEventiFuturi() : []
  const servizi = brand.sezioni.servizi ? getServiziAttivi() : []
  const racconto = copia('home.raccontoDefault', (lang === 'it' && imp.descrizione) || (brand.legacy && lang === 'en' ? 'Draught beer, late-night food and thirty years of good company, brick and dark wood.' : t.home.raccontoDefault))
  const contatto = imp.telefono ? { href: `tel:${imp.telefono.replace(/\s/g, '')}`, testo: t.menu.chiama } : imp.instagram ? { href: imp.instagram, testo: t.menu.chiedi } : null
  const fatti = [
    ...(imp.orari.length ? [{ icona: Clock, nome: t.footer.orari, righe: imp.orari.map((f) => [f.giorni, f.orario].filter(Boolean).join(' · ')), href: '' }] : []),
    ...(imp.indirizzo ? [{ icona: MapPin, nome: t.dove.indirizzo, righe: [imp.indirizzo], href: percorso(lang, '/dove') }] : []),
    ...(imp.telefono ? [{ icona: Phone, nome: t.dove.telefono, righe: [imp.telefono], href: `tel:${imp.telefono.replace(/\s/g, '')}` }] : []),
  ]

  return <>
    <section className={`pub-hero${brand.hero ? '' : ' pub-hero-no-photo'}`} aria-labelledby="pub-title">
      {brand.hero && <Image className="pub-hero-photo" src={brand.hero} alt={brand.heroAlt || t.home.altSala} fill sizes="100vw" preload />}
      <div className="pub-hero-shade" />
      <div className="pub-hero-frame" aria-hidden />
      <div className="pub-hero-content">
        <p className="pub-kicker">{copia('home.kicker', t.home.kicker)}</p>
        <h1 id="pub-title">{nome}</h1>
        <div className="pub-ornament" aria-hidden><span />✦<span /></div>
        <p className="pub-hero-description">{racconto}</p>
        <div className="pub-actions"><a href={brand.sezioni.menu ? '#menu' : percorso(lang, '/menu')} className="pub-button">{t.home.vediMenu}</a><a href={percorso(lang, '/dove')} className="pub-button pub-button-outline">{t.nav.dove}</a></div>
      </div>
    </section>

    {fatti.length > 0 && <div className="pub-service-strip"><div className="pub-container pub-service-grid">{fatti.map((f) => <div key={f.nome} className="pub-service-item"><f.icona size={19} strokeWidth={1.5} aria-hidden /><div><p className="pub-service-label">{f.nome}</p>{f.righe.map((r) => f.href ? <a key={r} href={f.href}>{r}</a> : <p key={r}>{r}</p>)}</div></div>)}</div></div>}

    {brand.legacy && <section className="pub-story pub-container">
      <div><h2>{t.home.titoloStoria}</h2><p>{t.home.raccontoDefault}</p><a href={percorso(lang, '/galleria')} className="pub-text-link">{t.galleria.titolo}<span aria-hidden>→</span></a></div>
      <figure><Image src="/taproom/foto-spine.jpg" alt={t.home.altPinta} width={960} height={660} sizes="(max-width: 600px) 90vw, 45vw" loading="lazy" /><figcaption>{lang === 'it' ? 'Una buona pinta. Il posto giusto.' : 'A good pint. The right place.'}</figcaption></figure>
    </section>}

    {brand.sezioni.birre && brand.birre.length > 0 && <section id="birre" className="pub-paper pub-section"><div className="pub-container"><div className="pub-section-heading"><h2>{copia('home.nostreBirre', t.home.nostreBirre)}</h2><p>{copia('home.birreBlurb', t.home.birreBlurb)}</p></div><MuroBirre birre={brand.birre} /></div></section>}

    {brand.sezioni.menu && <section id="menu" className="pub-section pub-menu-section"><div className="pub-container"><div className="pub-section-heading"><p className="pub-kicker">{t.home.laCarta}</p><h2>{copia('home.ilMenu', t.home.ilMenu)}</h2><p>{copia('home.menuBlurb', t.home.menuBlurb)}</p></div>{categorie.length > 0 ? <CartaMenu categorie={categorie} locale={t.locale} vediTutto={t.menu.vediTutto} hrefMenu={percorso(lang, '/menu')} /> : <div className="pub-empty"><p>{t.menu.inAggiornamento}</p>{contatto && <a href={contatto.href} className="pub-button">{contatto.testo}</a>}</div>}</div></section>}

    {brand.sezioni.galleria && foto.length > 0 && <section className="pub-paper pub-section"><div className="pub-container"><div className="pub-gallery-heading"><div><h2>{copia('home.laSala', t.home.laSala)}</h2><p>{lang === 'it' ? 'Legno scuro, luci calde e un tavolo per te.' : 'Dark wood, warm lights and a table for you.'}</p></div><a href={percorso(lang, '/galleria')} className="pub-text-link">{t.home.tuttaGalleria}<span aria-hidden>→</span></a></div><div className="pub-gallery-preview">{foto.map((f) => <Image key={f.src} src={f.src} alt={f.didascalia || t.home.altFoto(nome)} width={960} height={720} sizes="(max-width: 600px) 90vw, (max-width: 859px) 45vw, 33vw" loading="lazy" />)}</div></div></section>}

    {eventi.length > 0 && <section className="pub-section pub-container"><div className="pub-section-heading"><h2>{lang === 'it' ? 'Al pub' : 'At the pub'}</h2></div><ul className="pub-events">{eventi.map((e) => <li key={e.id}>{e.immagine && <Image src={`/uploads/${e.immagine}`} alt="" width={640} height={480} sizes="(max-width: 600px) 90vw, 240px" loading="lazy" />}<div><p className="pub-event-date">{e.dataOra.replace('T', ' · ')}</p><h3>{e.titolo}</h3><p>{e.descrizione}</p></div></li>)}</ul></section>}
    {servizi.length > 0 && <section className="pub-section pub-container"><div className="pub-section-heading"><h2>{lang === 'it' ? 'Da noi' : 'At our pub'}</h2></div><ul className="pub-services">{servizi.map((s) => <li key={s.id}>{s.logo && <Image src={`/uploads/${s.logo}`} alt="" width={140} height={70} loading="lazy" />}<p>{s.nome}</p></li>)}</ul></section>}
  </>
}
