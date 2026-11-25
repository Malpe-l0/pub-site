import type { Metadata } from 'next'
import Image from 'next/image'
import { getGalleriaPubblica, getImpostazioni } from '@/lib/dati'
import { dizionario, type Lang } from '@/lib/dizionario'
import { fotoDelLocale } from '@/components/sito/foto'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang
  return { title: dizionario(lang).galleria.titolo, alternates: { languages: { it: '/galleria', en: '/en/galleria' } } }
}

export default async function PaginaGalleria({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const imp = getImpostazioni()
  const vetrina = getGalleriaPubblica()
  const foto = fotoDelLocale(vetrina.foto, imp.branding.legacy, lang)
  const nome = imp.nomePub || 'Il nostro pub'

  return <>
    <div className="pub-page-intro pub-container"><h1>{t.galleria.titolo}</h1>{imp.branding.legacy && <p>{lang === 'it' ? 'Legno scuro, luci calde. La nostra porta è aperta dal 1993.' : 'Dark wood, warm lights. Our door has been open since 1993.'}</p>}</div>
    <div className="pub-paper pub-gallery-page"><div className="pub-container">
      {foto.length === 0 ? <div className="pub-empty"><p>{t.galleria.fotoPresto}</p></div> : <ul className="pub-photo-grid">{foto.map((f, i) => {
        const immagine = <Image src={f.src} alt={f.didascalia || t.home.altFoto(nome)} width={960} height={720} sizes="(max-width: 600px) 90vw, (max-width: 859px) 45vw, 60vw" loading={i === 0 ? 'eager' : 'lazy'} />
        return <li key={`${f.src}-${i}`}><figure>{f.href ? <a href={f.href} target="_blank" rel="noopener noreferrer" aria-label={t.galleria.apriPost}>{immagine}</a> : immagine}{f.didascalia && <figcaption>{f.didascalia}</figcaption>}</figure></li>
      })}</ul>}
      {(vetrina.fonte === 'instagram' || vetrina.fonte === 'mista') && foto.some((f) => f.href) && <p className="pub-instagram-note">{t.galleria.notaInstagram}</p>}
    </div></div>
  </>
}
