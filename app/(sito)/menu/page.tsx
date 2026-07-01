import type { Metadata } from 'next'
import { getMenuPubblico } from '@/lib/dati'

export const metadata: Metadata = { title: 'Menu' }

export default async function PaginaMenu() {
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  return (
    <div className="mx-auto max-w-[900px] px-[clamp(24px,5vw,40px)] pt-[120px] pb-[clamp(64px,9vw,110px)]">
      <h1 className="font-titoli mb-12 text-[clamp(2.8rem,7vw,4.6rem)] leading-[1] font-bold">
        Il menu
      </h1>

      {categorie.length === 0 ? (
        <p className="text-panna-3">Il menu è in aggiornamento, torna a trovarci presto.</p>
      ) : (
        categorie.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="mb-12">
            <h2
              id={`cat-${cat.id}`}
              className="font-titoli text-ambra-ink border-ambra/25 mb-6 border-b pb-[10px] text-[1.7rem] font-bold"
            >
              {cat.nome}
            </h2>
            <ul className="space-y-6">
              {cat.voci.map((v) => (
                <li key={v.id} className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-titoli text-panna text-[1.2rem] font-semibold">
                        {v.nome}
                      </h3>
                      <span
                        aria-hidden
                        className="border-panna-4/40 mx-1 flex-1 border-b border-dotted"
                      />
                      <p className="font-titoli text-ambra-ink text-[1.1rem] font-semibold whitespace-nowrap">
                        {euro.format(v.prezzoCentesimi / 100)}
                      </p>
                    </div>
                    {v.descrizione && (
                      <p className="text-panna-3 mt-1 text-[0.97rem] leading-[1.6]">
                        {v.descrizione}
                      </p>
                    )}
                  </div>
                  {v.foto && (
                    <img
                      src={`/uploads/${v.foto}`}
                      alt={v.nome}
                      loading="lazy"
                      className="h-20 w-20 shrink-0 rounded-[4px] object-cover"
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
