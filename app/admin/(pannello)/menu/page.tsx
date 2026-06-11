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

      <section aria-label="Nuova categoria">
        <h2>Nuova categoria</h2>
        <form action={creaCategoria}>
          <input name="nome" placeholder="Es. Birre alla spina" required />
          <input type="number" name="ordine" defaultValue={categorie.length} aria-label="Ordine" />
          <button>Crea categoria</button>
        </form>
      </section>

      {categorie.map((categoria) => (
        <section key={categoria.id} aria-label={categoria.nome}>
          <form action={aggiornaCategoria}>
            <input type="hidden" name="id" value={categoria.id} />
            <input name="nome" defaultValue={categoria.nome} required aria-label="Nome categoria" />
            <input
              type="number"
              name="ordine"
              defaultValue={categoria.ordine}
              aria-label="Ordine"
            />
            <button>Rinomina</button>
          </form>
          <details>
            <summary>Elimina categoria (con tutte le sue voci)</summary>
            <form action={eliminaCategoria}>
              <input type="hidden" name="id" value={categoria.id} />
              <button>Conferma eliminazione di “{categoria.nome}”</button>
            </form>
          </details>

          <p>
            <Link href={`/admin/menu/voce/nuova?categoria=${categoria.id}`}>
              + Nuova voce in {categoria.nome}
            </Link>
          </p>

          {categoria.voci.length === 0 ? (
            <p>Nessuna voce.</p>
          ) : (
            <ul>
              {categoria.voci.map((voce) => (
                <li key={voce.id}>
                  {voce.nome} — {euro.format(voce.prezzoCentesimi / 100)}
                  {!voce.disponibile && ' (nascosta dal sito)'}{' '}
                  <Link href={`/admin/menu/voce/${voce.id}`}>Modifica</Link>{' '}
                  <form action={impostaDisponibile} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={voce.id} />
                    <input type="hidden" name="disponibile" value={voce.disponibile ? '0' : '1'} />
                    <button>{voce.disponibile ? 'Nascondi' : 'Mostra'}</button>
                  </form>{' '}
                  <details style={{ display: 'inline-block' }}>
                    <summary>Elimina</summary>
                    <form action={eliminaVoce}>
                      <input type="hidden" name="id" value={voce.id} />
                      <button>Conferma eliminazione di “{voce.nome}”</button>
                    </form>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  )
}
