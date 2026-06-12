import type { Metadata } from 'next'
import { getClassifica } from '@/lib/dati'
import { creaTokenPartita } from '@/lib/gioco'
import { SpillataPerfetta } from '@/components/gioco/SpillataPerfetta'
import { TitoloSezione } from '@/components/TitoloSezione'

export const metadata: Metadata = { title: 'La spillata perfetta' }

export default async function PaginaGioco() {
  const classifica = getClassifica()

  return (
    <>
      <h1 className="font-titoli text-verde mt-8 mb-2 text-4xl">La spillata perfetta</h1>
      <p className="mb-6 max-w-xl">
        Dietro il bancone non si improvvisa: la pinta va fermata sulla riga, e la spina è più
        svelta di quanto sembri. Vediamo quanto duri.
      </p>

      <SpillataPerfetta token={creaTokenPartita()} />

      <section aria-labelledby="titolo-classifica" className="mt-12">
        <TitoloSezione id="titolo-classifica">La lavagna dei campioni</TitoloSezione>
        {classifica.length === 0 ? (
          <p>Nessuno ha ancora lasciato la firma: la prima riga della lavagna aspetta te.</p>
        ) : (
          <ol className="mx-auto max-w-md space-y-2">
            {classifica.map((riga, indice) => (
              <li key={riga.id} className="flex items-baseline gap-2">
                <span className="w-7 text-right">{indice + 1}.</span>
                <span className="font-mono font-semibold tracking-[0.2em]">{riga.sigla}</span>
                <span aria-hidden className="border-ottone/40 mx-1 flex-1 border-b-2 border-dotted" />
                <span className="text-verde font-semibold">{riga.punteggio}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  )
}
