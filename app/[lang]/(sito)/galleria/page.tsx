import type { Metadata } from 'next'
import { getGalleriaPubblica, getImpostazioni } from '@/lib/dati'
import { dizionario, type Lang } from '@/lib/dizionario'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const lang = (await params).lang as Lang
  return {
    title: dizionario(lang).galleria.titolo,
    alternates: { languages: { it: '/galleria', en: '/en/galleria' } },
  }
}

export default async function PaginaGalleria({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const { fonte, foto } = getGalleriaPubblica()
  const nome = getImpostazioni().nomePub || 'Il nostro pub'

  return (
    <div className="mx-auto max-w-[1320px] px-[clamp(24px,5vw,40px)] pt-[120px] pb-[clamp(64px,9vw,110px)]">
      <h1 className="font-titoli mb-12 text-[clamp(2.8rem,7vw,4.6rem)] leading-[1] font-bold">
        {t.galleria.titolo}
      </h1>

      {foto.length === 0 ? (
        <p className="text-panna-3">{t.galleria.fotoPresto}</p>
      ) : (
        <ul
          className="grid gap-[12px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {foto.map((f, i) => {
            const img = (
              <img
                src={f.src}
                alt={f.didascalia || t.home.altFoto(nome)}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[4px] object-cover"
              />
            )
            return (
              <li key={i}>
                <figure>
                  {f.href ? (
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.galleria.apriPost}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                  {f.didascalia && (
                    <figcaption className="text-panna-4 mt-2 text-[0.9rem] italic">
                      {f.didascalia}
                    </figcaption>
                  )}
                </figure>
              </li>
            )
          })}
        </ul>
      )}

      {fonte === 'instagram' && (
        <p className="text-panna-4 mt-9 text-[0.85rem]">{t.galleria.notaInstagram}</p>
      )}
    </div>
  )
}
