import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { getMenuCompleto } from '@/lib/dati'
import {
  creaCategoria,
  aggiornaCategoria,
  eliminaCategoria,
  impostaDisponibile,
  eliminaVoce,
} from './azioni'

export default async function PaginaMenuAdmin() {
  await richiediAdmin()
  const categorie = getMenuCompleto()
  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  return (
    <>
      <h1>Menu</h1>

      <details className="mb-2">
        <summary>+ Nuova categoria</summary>
        <form action={creaCategoria}>
          <label>
            Nome
            <input name="nome" placeholder="Es. Birre alla spina" required />
          </label>
          <label>
            Posizione (numero basso = più in alto)
            <input type="number" name="ordine" defaultValue={categorie.length} />
          </label>
          <button>Crea categoria</button>
        </form>
      </details>

      {categorie.map((categoria) => (
        <section key={categoria.id} aria-labelledby={`categoria-${categoria.id}`} className="mt-10">
          <h2 id={`categoria-${categoria.id}`}>{categoria.nome}</h2>

          {categoria.voci.length === 0 ? (
            <p>Nessuna voce.</p>
          ) : (
            <ul>
              {categoria.voci.map((voce) => (
                <li
                  key={voce.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                >
                  <span>
                    {voce.nome} — {euro.format(voce.prezzoCentesimi / 100)}
                    {!voce.disponibile && <em> (nascosta dal sito)</em>}
                  </span>
                  <span className="flex flex-wrap items-baseline gap-x-4">
                    <Link href={`/admin/menu/voce/${voce.id}`}>Modifica</Link>
                    <form action={impostaDisponibile} style={{ display: 'inline' }}>
                      <input type="hidden" name="id" value={voce.id} />
                      <input
                        type="hidden"
                        name="disponibile"
                        value={voce.disponibile ? '0' : '1'}
                      />
                      <button className="secondario">
                        {voce.disponibile ? 'Nascondi' : 'Mostra'}
                      </button>
                    </form>
                    <details style={{ display: 'inline-block' }} className="pericolo">
                      <summary>Elimina</summary>
                      <form action={eliminaVoce}>
                        <input type="hidden" name="id" value={voce.id} />
                        <button>Conferma eliminazione di “{voce.nome}”</button>
                      </form>
                    </details>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p>
            <Link href={`/admin/menu/voce/nuova?categoria=${categoria.id}`}>
              + Nuova voce in {categoria.nome}
            </Link>
          </p>

          <details>
            <summary>Rinomina o sposta la categoria</summary>
            <form action={aggiornaCategoria}>
              <input type="hidden" name="id" value={categoria.id} />
              <label>
                Nome categoria
                <input name="nome" defaultValue={categoria.nome} required />
              </label>
              <label>
                Posizione (numero basso = più in alto)
                <input type="number" name="ordine" defaultValue={categoria.ordine} />
              </label>
              <button>Salva</button>
            </form>
          </details>
          <details className="pericolo">
            <summary>Elimina categoria (con tutte le sue voci)</summary>
            <form action={eliminaCategoria}>
              <input type="hidden" name="id" value={categoria.id} />
              <button>Conferma eliminazione di “{categoria.nome}”</button>
            </form>
          </details>
        </section>
      ))}
    </>
  )
}
