import type { CategoriaConVoci } from '@/lib/tipi'

export function ListaMenu({ categorie }: { categorie: CategoriaConVoci[] }) {
  const conVoci = categorie.filter((categoria) => categoria.voci.length > 0)

  if (conVoci.length === 0) {
    return <p>Il menu è in aggiornamento, torna a trovarci presto.</p>
  }

  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  return (
    <>
      {conVoci.map((categoria) => (
        <section
          key={categoria.id}
          aria-labelledby={`categoria-${categoria.id}`}
          className="mb-10"
        >
          <h2
            id={`categoria-${categoria.id}`}
            className="font-titoli text-verde border-ottone mb-4 border-b-[3px] border-double pb-1 text-2xl"
          >
            {categoria.nome}
          </h2>
          <ul className="space-y-4">
            {categoria.voci.map((voce) => (
              <li key={voce.id} className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold">{voce.nome}</h3>
                    <span
                      aria-hidden
                      className="border-ottone/40 mx-1 flex-1 border-b-2 border-dotted"
                    />
                    <p className="text-verde font-semibold whitespace-nowrap">
                      {euro.format(voce.prezzoCentesimi / 100)}
                    </p>
                  </div>
                  {voce.descrizione && (
                    <p className="text-inchiostro/70 mt-0.5 text-sm">{voce.descrizione}</p>
                  )}
                </div>
                {voce.foto && (
                  <img
                    src={`/uploads/${voce.foto}`}
                    alt={voce.nome}
                    loading="lazy"
                    className="h-24 w-24 shrink-0 rounded object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
