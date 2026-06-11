import { richiediAdmin } from '@/lib/auth'
import { getImpostazioni } from '@/lib/dati'
import { OrariEditor } from '@/components/admin/OrariEditor'
import { salvaImpostazioni } from './azioni'

export default async function PaginaImpostazioni({
  searchParams,
}: {
  searchParams: Promise<{ salvato?: string }>
}) {
  await richiediAdmin()
  const impostazioni = getImpostazioni()
  const { salvato } = await searchParams

  return (
    <>
      <h1>Impostazioni del sito</h1>
      {salvato && <p role="status">Salvato.</p>}
      <form action={salvaImpostazioni}>
        <p>
          <label>
            Nome del pub
            <input name="nomePub" defaultValue={impostazioni.nomePub} required />
          </label>
        </p>
        <p>
          <label>
            Descrizione breve
            <textarea name="descrizione" defaultValue={impostazioni.descrizione} rows={3} />
          </label>
        </p>
        <p>
          <label>
            Indirizzo
            <input name="indirizzo" defaultValue={impostazioni.indirizzo} />
          </label>
        </p>
        <p>
          <label>
            Telefono
            <input name="telefono" defaultValue={impostazioni.telefono} />
          </label>
        </p>
        <p>
          <label>
            Email
            <input type="email" name="email" defaultValue={impostazioni.email} />
          </label>
        </p>
        <p>
          <label>
            Pagina Facebook (link)
            <input type="url" name="facebook" defaultValue={impostazioni.facebook} />
          </label>
        </p>
        <p>
          <label>
            Profilo Instagram (link)
            <input type="url" name="instagram" defaultValue={impostazioni.instagram} />
          </label>
        </p>
        <OrariEditor iniziali={impostazioni.orari} />
        <fieldset>
          <legend>Struttura del sito</legend>
          <p>
            <label>
              <input
                type="radio"
                name="stileSito"
                value="multipagina"
                defaultChecked={impostazioni.stileSito === 'multipagina'}
              />{' '}
              Multipagina — menu e galleria su pagine separate
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="stileSito"
                value="onepage"
                defaultChecked={impostazioni.stileSito === 'onepage'}
              />{' '}
              Pagina unica — tutto in home, la barra in alto scorre alle sezioni
            </label>
          </p>
        </fieldset>
        <button>Salva</button>
      </form>
    </>
  )
}
