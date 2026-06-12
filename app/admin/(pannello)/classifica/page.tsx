import { richiediAdmin } from '@/lib/auth'
import { getPunteggi } from '@/lib/dati'
import { eliminaPunteggio, svuotaClassifica } from './azioni'

// creato_il è in UTC (datetime('now') di SQLite): si mostra in ora italiana.
const formato = new Intl.DateTimeFormat('it-IT', {
  timeZone: 'Europe/Rome',
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default async function PaginaClassificaAdmin() {
  await richiediAdmin()
  const punteggi = getPunteggi()

  return (
    <>
      <h1>Classifica del gioco</h1>
      <p>
        I punteggi della Spillata perfetta (pagina /gioco del sito). Le sigle sgradite si
        eliminano da qui; la classifica pubblica mostra le prime dieci.
      </p>

      {punteggi.length === 0 ? (
        <p>Nessun punteggio registrato.</p>
      ) : (
        <>
          <ul>
            {punteggi.map((riga, indice) => (
              <li key={riga.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span>
                  {indice + 1}. <strong>{riga.sigla}</strong> — {riga.punteggio} punti
                  <em> ({formato.format(new Date(riga.creatoIl + 'Z'))})</em>
                </span>
                <details style={{ display: 'inline-block' }} className="pericolo">
                  <summary>Elimina</summary>
                  <form action={eliminaPunteggio}>
                    <input type="hidden" name="id" value={riga.id} />
                    <button>Conferma eliminazione di “{riga.sigla} — {riga.punteggio}”</button>
                  </form>
                </details>
              </li>
            ))}
          </ul>

          <details className="pericolo mt-6">
            <summary>Svuota tutta la classifica</summary>
            <form action={svuotaClassifica}>
              <button>Conferma: cancella tutti i {punteggi.length} punteggi</button>
            </form>
          </details>
        </>
      )}
    </>
  )
}
