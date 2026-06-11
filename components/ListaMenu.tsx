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
        <section key={categoria.id} aria-labelledby={`categoria-${categoria.id}`}>
          <h2 id={`categoria-${categoria.id}`}>{categoria.nome}</h2>
          <ul>
            {categoria.voci.map((voce) => (
              <li key={voce.id}>
                <h3>{voce.nome}</h3>
                {voce.descrizione && <p>{voce.descrizione}</p>}
                <p>{euro.format(voce.prezzoCentesimi / 100)}</p>
                {voce.foto && (
                  <img src={`/uploads/${voce.foto}`} alt={voce.nome} loading="lazy" />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
