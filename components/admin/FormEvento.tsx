import type { Evento } from '@/lib/tipi'

export function FormEvento({
  evento,
  azione,
}: {
  evento: Evento | null
  azione: (formData: FormData) => Promise<void>
}) {
  return (
    <form action={azione} encType="multipart/form-data">
      {evento && <input type="hidden" name="id" value={evento.id} />}
      <p>
        <label>
          Titolo
          <input name="titolo" defaultValue={evento?.titolo ?? ''} required />
        </label>
      </p>
      <p>
        <label>
          Data e ora
          <input type="datetime-local" name="dataOra" defaultValue={evento?.dataOra ?? ''} required />
        </label>
      </p>
      <p>
        <label>
          Descrizione (facoltativa)
          <textarea name="descrizione" defaultValue={evento?.descrizione ?? ''} rows={3} />
        </label>
      </p>
      {evento?.immagine && (
        <p>
          Immagine attuale: <img src={`/uploads/${evento.immagine}`} alt="" style={{ height: 80 }} />{' '}
          <label>
            <input type="checkbox" name="rimuoviImmagine" /> Rimuovi immagine
          </label>
        </p>
      )}
      <p>
        <label>
          {evento?.immagine ? 'Sostituisci immagine' : 'Immagine (facoltativa)'}
          <input type="file" name="immagine" accept="image/*" />
        </label>
      </p>
      <button>Salva</button>
    </form>
  )
}
