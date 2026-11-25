import { richiediAdmin } from '@/lib/auth'
import { getPopup } from '@/lib/dati'
import { popupDaMostrare } from '@/lib/popup'
import { salvaPopup } from './azioni'

export default async function PaginaPopup({
  searchParams,
}: {
  searchParams: Promise<{ salvato?: string }>
}) {
  await richiediAdmin()
  const popup = getPopup()
  const { salvato } = await searchParams
  const visibileOra = popupDaMostrare(popup) !== null

  return (
    <>
      <h1>Avvisi sul sito</h1>
      <p>
        Comunica una chiusura o una novità. Scrivi l’avviso, scegli quando mostrarlo e abilitalo: comparirà in una finestra all’apertura del sito.
      </p>
      {salvato && <p role="status">Salvato. In questo momento il pop-up {visibileOra ? 'È VISIBILE' : 'non è visibile'} sul sito.</p>}
      <form action={salvaPopup}>
        <p>
          <label>
            <input type="checkbox" name="attivo" defaultChecked={popup.attivo} /> Abilita l’avviso
          </label>
        </p>
        <p>
          <label>
            Titolo
            <input name="titolo" defaultValue={popup.titolo} placeholder="Pausa estiva" />
          </label>
        </p>
        <p>
          <label>
            Messaggio
            <textarea
              name="messaggio"
              defaultValue={popup.messaggio}
              rows={4}
              placeholder="Chiudiamo dal 10 al 25 agosto, ci vediamo al rientro!"
            />
          </label>
        </p>
        <p>
          <label>
            Mostra a partire dal (facoltativo)
            <input type="date" name="dataInizio" defaultValue={popup.dataInizio ?? ''} />
          </label>
        </p>
        <p>
          <label>
            Nascondi dopo il (facoltativo)
            <input type="date" name="dataFine" defaultValue={popup.dataFine ?? ''} />
          </label>
        </p>
        <button>Salva avviso</button>
      </form>
    </>
  )
}
