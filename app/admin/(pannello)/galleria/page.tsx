import { richiediAdmin } from '@/lib/auth'
import { getGalleria } from '@/lib/dati'
import { getStatoInstagram } from '@/lib/instagram'
import {
  caricaFoto,
  aggiornaFoto,
  eliminaFotoGalleria,
  configuraInstagram,
  sincronizzaOra,
} from './azioni'

export default async function PaginaGalleriaAdmin() {
  await richiediAdmin()
  const foto = getGalleria()
  const ig = getStatoInstagram()

  return (
    <>
      <h1>Galleria fotografica</h1>
      <p>
        La pagina Galleria compare sul sito se c’è almeno una foto: dai post di Instagram, oppure
        caricate qui sotto.
      </p>

      <h2>Sincronizza con Instagram</h2>
      <p>
        Se colleghi l’account Instagram (Business o Creator), la galleria mostra automaticamente gli
        ultimi 9 post. Le foto caricate più sotto restano come riserva e ricompaiono se Instagram
        non è disponibile.
      </p>
      <form action={configuraInstagram}>
        <label>
          ID account Instagram
          <input name="userId" defaultValue={ig.userId} placeholder="es. 17841401234567890" />
        </label>
        <label>
          Token di accesso (a lunga durata)
          <input
            name="accessToken"
            type="password"
            placeholder={ig.configurato ? '•••••• salvato — lascia vuoto per non cambiarlo' : 'Incolla qui il token'}
          />
        </label>
        <button>Salva credenziali</button>
      </form>
      <form action={sincronizzaOra} style={{ display: 'inline' }}>
        <button className="secondario" disabled={!ig.configurato}>
          Sincronizza ora
        </button>
      </form>
      <p>
        Stato:{' '}
        {ig.configurato
          ? `collegato — ${ig.numeroFoto} foto${ig.ultimaSync ? `, ultima sincronizzazione ${new Date(ig.ultimaSync).toLocaleString('it-IT')}` : ''}`
          : 'non collegato'}
        {ig.ultimoEsito ? ` — ${ig.ultimoEsito}` : ''}
      </p>

      <h2>Foto di riserva (caricate a mano)</h2>
      <p>Puoi selezionare più foto in una volta.</p>

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
