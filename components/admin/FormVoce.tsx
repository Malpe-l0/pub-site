import type { Categoria, VoceMenu } from '@/lib/tipi'

/**
 * Form condiviso per creare/modificare una voce del menu.
 * `azione` è la server action a cui inviare i dati.
 */
export function FormVoce({
  voce,
  categorie,
  categoriaPreselezionata,
  azione,
}: {
  voce: VoceMenu | null
  categorie: Categoria[]
  categoriaPreselezionata?: number
  azione: (formData: FormData) => Promise<void>
}) {
  return (
    <form action={azione} encType="multipart/form-data">
      {voce && <input type="hidden" name="id" value={voce.id} />}
      <p>
        <label>
          Nome
          <input name="nome" defaultValue={voce?.nome ?? ''} required />
        </label>
      </p>
      <p>
        <label>
          Descrizione (facoltativa)
          <textarea name="descrizione" defaultValue={voce?.descrizione ?? ''} rows={2} />
        </label>
      </p>
      <p>
        <label>
          Prezzo (€)
          <input
            type="number"
            name="prezzo"
            step="0.01"
            min="0"
            defaultValue={voce ? (voce.prezzoCentesimi / 100).toFixed(2) : ''}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Categoria
          <select
            name="categoriaId"
            defaultValue={voce?.categoriaId ?? categoriaPreselezionata}
            required
          >
            {categorie.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>
      </p>
      <p>
        <label>
          Posizione nella categoria (numero basso = più in alto)
          <input type="number" name="ordine" defaultValue={voce?.ordine ?? 0} />
        </label>
      </p>
      <p>
        <label>
          <input type="checkbox" name="disponibile" defaultChecked={voce?.disponibile ?? true} />{' '}
          Disponibile (visibile sul sito)
        </label>
      </p>
      {voce?.foto && (
        <p>
          Foto attuale: <img src={`/uploads/${voce.foto}`} alt="" style={{ height: 80 }} />{' '}
          <label>
            <input type="checkbox" name="rimuoviFoto" /> Rimuovi foto
          </label>
        </p>
      )}
      <p>
        <label>
          {voce?.foto ? 'Sostituisci foto' : 'Foto (facoltativa)'}
          <input type="file" name="foto" accept="image/*" />
        </label>
      </p>
      <button>Salva</button>
    </form>
  )
}
