import { richiediAdmin } from '@/lib/auth'
import { getServizi } from '@/lib/dati'
import { creaServizio, aggiornaServizio, impostaAttivo, eliminaServizio } from './azioni'

export default async function PaginaServiziAdmin() {
  await richiediAdmin()
  const servizi = getServizi()

  return (
    <>
      <h1>Servizi (loghi del carosello)</h1>
      <p>I loghi attivi scorrono nel carosello in home (Sky, Serie A, DAZN, ...).</p>

      <section aria-label="Nuovo servizio">
        <h2>Nuovo servizio</h2>
        <form action={creaServizio} encType="multipart/form-data">
          <label>
            Nome
            <input name="nome" placeholder="Es. Sky" required />
          </label>
          <label>
            Posizione (numero basso = più in alto)
            <input type="number" name="ordine" defaultValue={servizi.length} />
          </label>
          <label>
            Logo
            <input type="file" name="logo" accept="image/*" />
          </label>
          <button>Aggiungi</button>
        </form>
      </section>

      {servizi.length === 0 ? (
        <p>Nessun servizio inserito.</p>
      ) : (
        <ul>
          {servizi.map((servizio) => (
            <li key={servizio.id}>
              {servizio.logo && (
                <img src={`/uploads/${servizio.logo}`} alt="" style={{ height: 40 }} />
              )}
              <form action={aggiornaServizio} encType="multipart/form-data" style={{ display: 'inline' }}>
                <input type="hidden" name="id" value={servizio.id} />
                <label>
                  Nome
                  <input name="nome" defaultValue={servizio.nome} required />
                </label>
                <label>
                  Posizione (numero basso = più in alto)
                  <input type="number" name="ordine" defaultValue={servizio.ordine} />
                </label>
                <label>
                  Sostituisci logo
                  <input type="file" name="logo" accept="image/*" />
                </label>
                <button>Salva</button>
              </form>{' '}
              <form action={impostaAttivo} style={{ display: 'inline' }}>
                <input type="hidden" name="id" value={servizio.id} />
                <input type="hidden" name="attivo" value={servizio.attivo ? '0' : '1'} />
                <button>{servizio.attivo ? 'Nascondi dal sito' : 'Mostra sul sito'}</button>
              </form>{' '}
              {!servizio.attivo && '(nascosto)'}{' '}
              <details style={{ display: 'inline-block' }} className="pericolo">
                <summary>Elimina</summary>
                <form action={eliminaServizio}>
                  <input type="hidden" name="id" value={servizio.id} />
                  <button>Conferma eliminazione di “{servizio.nome}”</button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
