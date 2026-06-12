import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { getEventi } from '@/lib/dati'
import { adessoInItalia, formattaDataOra } from '@/lib/dataora'
import { eliminaEvento } from './azioni'

export default async function PaginaEventiAdmin() {
  await richiediAdmin()
  const eventi = getEventi()
  const adesso = adessoInItalia()

  return (
    <>
      <h1>Eventi</h1>
      <p>
        Gli eventi con data futura compaiono in home; quelli passati spariscono da soli (qui
        restano, per riusarli).
      </p>
      <p>
        <Link href="/admin/eventi/nuovo">+ Nuovo evento</Link>
      </p>
      {eventi.length === 0 ? (
        <p>Nessun evento inserito.</p>
      ) : (
        <ul>
          {eventi.map((evento) => (
            <li key={evento.id}>
              {evento.titolo} — {formattaDataOra(evento.dataOra)}
              {evento.dataOra < adesso && ' (passato, non visibile sul sito)'}{' '}
              <Link href={`/admin/eventi/${evento.id}`}>Modifica</Link>{' '}
              <details style={{ display: 'inline-block' }} className="pericolo">
                <summary>Elimina</summary>
                <form action={eliminaEvento}>
                  <input type="hidden" name="id" value={evento.id} />
                  <button>Conferma eliminazione di “{evento.titolo}”</button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
