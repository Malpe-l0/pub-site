import type { Evento } from '@/lib/tipi'
import { formattaDataOra } from '@/lib/dataora'

/** Compare solo se ci sono eventi futuri: con lista vuota non renderizza nulla. */
export function SezioneEventi({ eventi }: { eventi: Evento[] }) {
  if (eventi.length === 0) return null

  return (
    <section id="eventi" aria-labelledby="titolo-eventi">
      <h2 id="titolo-eventi">Prossimi eventi</h2>
      <ul>
        {eventi.map((evento) => (
          <li key={evento.id}>
            <article>
              <h3>{evento.titolo}</h3>
              <p>
                <time dateTime={evento.dataOra}>{formattaDataOra(evento.dataOra)}</time>
              </p>
              {evento.descrizione && <p>{evento.descrizione}</p>}
              {evento.immagine && (
                <img src={`/uploads/${evento.immagine}`} alt="" loading="lazy" />
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
