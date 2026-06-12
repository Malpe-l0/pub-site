import { richiediAdmin } from '@/lib/auth'
import { getGalleria } from '@/lib/dati'
import { caricaFoto, aggiornaFoto, eliminaFotoGalleria } from './azioni'

export default async function PaginaGalleriaAdmin() {
  await richiediAdmin()
  const foto = getGalleria()

  return (
    <>
      <h1>Galleria fotografica</h1>
      <p>
        La pagina Galleria compare sul sito solo se c’è almeno una foto. Puoi selezionare più foto
        in una volta.
      </p>

      <form action={caricaFoto} encType="multipart/form-data">
        <label>
          Carica foto
          <input type="file" name="foto" accept="image/*" multiple required />
        </label>
        <button>Carica</button>
      </form>

      {foto.length === 0 ? (
        <p>Nessuna foto caricata.</p>
      ) : (
        <ul>
          {foto.map((f) => (
            <li key={f.id}>
              <img src={`/uploads/${f.file}`} alt="" style={{ height: 120 }} />
              <form action={aggiornaFoto} style={{ display: 'inline' }}>
                <input type="hidden" name="id" value={f.id} />
                <label>
                  Didascalia (facoltativa)
                  <input name="didascalia" defaultValue={f.didascalia} placeholder="Es. Il bancone" />
                </label>
                <label>
                  Posizione (numero basso = più in alto)
                  <input type="number" name="ordine" defaultValue={f.ordine} />
                </label>
                <button>Salva</button>
              </form>{' '}
              <details style={{ display: 'inline-block' }} className="pericolo">
                <summary>Elimina</summary>
                <form action={eliminaFotoGalleria}>
                  <input type="hidden" name="id" value={f.id} />
                  <button>Conferma eliminazione</button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
