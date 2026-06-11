import type { Evento } from '@/lib/tipi'
import { formattaDataOra, giornoMese } from '@/lib/dataora'
import { TitoloSezione } from '@/components/TitoloSezione'

/** Compare solo se ci sono eventi futuri: con lista vuota non renderizza nulla. */
export function SezioneEventi({ eventi }: { eventi: Evento[] }) {
  if (eventi.length === 0) return null

  return (
    <section id="eventi" aria-labelledby="titolo-eventi" className="mt-12">
      <TitoloSezione id="titolo-eventi">Prossimi eventi</TitoloSezione>
      <ul className="space-y-4">
        {eventi.map((evento) => {
          const { giorno, mese } = giornoMese(evento.dataOra)
          return (
            <li key={evento.id}>
              <article className="border-ottone/30 bg-pergamena flex gap-4 rounded border p-4">
                <div className="bg-verde text-crema flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded">
                  <span className="font-titoli text-2xl leading-none">{giorno}</span>
                  <span className="text-xs uppercase">{mese}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-titoli text-verde text-xl">{evento.titolo}</h3>
                  <p className="text-ottone text-sm">
                    <time dateTime={evento.dataOra}>{formattaDataOra(evento.dataOra)}</time>
                  </p>
                  {evento.descrizione && <p className="mt-1">{evento.descrizione}</p>}
                  {evento.immagine && (
                    <img
                      src={`/uploads/${evento.immagine}`}
                      alt=""
                      loading="lazy"
                      className="mt-3 max-h-64 rounded"
                    />
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
