import type { Metadata } from 'next'
import { getGalleriaPubblica } from '@/lib/dati'

export const metadata: Metadata = { title: 'Galleria' }

export default async function PaginaGalleria() {
  const { fonte, foto } = getGalleriaPubblica()

  return (
    <div className="mx-auto max-w-[1320px] px-[clamp(24px,5vw,40px)] pt-[120px] pb-[clamp(64px,9vw,110px)]">
      <h1 className="font-insegna mb-12 text-[clamp(2.8rem,7vw,4.6rem)] leading-[1] font-bold">
        Il locale
      </h1>

      {foto.length === 0 ? (
        <p className="text-panna-3">Le foto arrivano presto.</p>
      ) : (
        <ul
          className="grid gap-[12px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {foto.map((f, i) => {
            const img = (
              <img
                src={f.src}
                alt={f.didascalia || 'Foto del Chelsea House'}
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
                      aria-label="Apri il post su Instagram"
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
        <p className="text-panna-4 mt-9 text-[0.85rem]">
          Le ultime foto dal nostro Instagram — tocca una foto per aprire il post.
        </p>
      )}
    </div>
  )
}
