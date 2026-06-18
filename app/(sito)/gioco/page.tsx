import type { Metadata } from 'next'
import { getClassifica } from '@/lib/dati'
import { creaTokenPartita } from '@/lib/gioco'
import { SpillataPerfetta } from '@/components/gioco/SpillataPerfetta'

export const metadata: Metadata = { title: 'La spillata perfetta' }

export default async function PaginaGioco() {
  const classifica = getClassifica()

  return (
    <div className="mx-auto max-w-[900px] px-[clamp(24px,5vw,40px)] pt-[120px] pb-[clamp(64px,9vw,110px)]">
      <h1 className="font-titoli mb-2 text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] font-bold uppercase">
        La spillata perfetta
      </h1>
      <p className="text-panna-3 mb-8 max-w-xl">
        Dietro il bancone non si improvvisa: la pinta va fermata sulla riga, e la spina è più svelta
        di quanto sembri. Vediamo quanto duri.
      </p>

      <SpillataPerfetta token={creaTokenPartita()} />

      <section aria-labelledby="titolo-classifica" className="mt-12">
        <h2
          id="titolo-classifica"
          className="font-titoli text-ambra-ink border-ambra/25 mb-6 border-b pb-2 text-[1.6rem] font-semibold uppercase"
        >
          La lavagna dei campioni
        </h2>
        {classifica.length === 0 ? (
          <p className="text-panna-3">
            Nessuno ha ancora lasciato la firma: la prima riga della lavagna aspetta te.
          </p>
        ) : (
          <ol className="mx-auto max-w-md space-y-2">
            {classifica.map((riga, indice) => (
              <li key={riga.id} className="flex items-baseline gap-2">
                <span className="text-panna-3 w-7 text-right">{indice + 1}.</span>
                <span className="text-panna font-mono font-semibold tracking-[0.2em]">
                  {riga.sigla}
                </span>
                <span aria-hidden className="border-panna-4/40 mx-1 flex-1 border-b border-dotted" />
                <span className="text-ambra-ink font-semibold">{riga.punteggio}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
