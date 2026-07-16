'use client'

import { useState } from 'react'
import type { CategoriaConVoci, VoceMenu } from '@/lib/tipi'

function Riga({ v, euro }: { v: VoceMenu; euro: Intl.NumberFormat }) {
  return (
    <div className="flex items-baseline gap-[14px] border-b border-[rgb(244_238_221/0.18)] px-[2px] py-[15px]">
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="font-titoli text-panna text-[1.06rem]">{v.nome}</span>
        {v.descrizione && (
          <span className="font-testo text-panna-3 text-[0.82rem] italic">{v.descrizione}</span>
        )}
      </span>
      <span
        aria-hidden
        className="min-w-[20px] flex-1 -translate-y-[5px] border-b border-dotted border-[rgb(244_238_221/0.32)]"
      />
      <span className="text-ambra-ink text-[0.86rem] tracking-[0.06em] whitespace-nowrap">
        {euro.format(v.prezzoCentesimi / 100)}
      </span>
    </div>
  )
}

/** Home: mobile = 2 categorie + Vedi tutto → /menu; desktop = schede. */
export function CartaMenu({
  categorie,
  locale,
  vediTutto,
  hrefMenu,
}: {
  categorie: CategoriaConVoci[]
  locale: string
  vediTutto: string
  hrefMenu: string
}) {
  const euro = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
  const [attiva, setAttiva] = useState(categorie[0].id)
  const corrente = categorie.find((c) => c.id === attiva) ?? categorie[0]
  const anteprima = categorie.slice(0, 2)

  return (
    <>
      {/* Mobile: niente tab — un paio di categorie, poi la carta intera su /menu */}
      <div className="sm:hidden">
        {anteprima.map((c) => (
          <div key={c.id} className="mb-8">
            <h3 className="font-titoli text-ambra-ink mb-3 text-[1.25rem] font-semibold">
              {c.nome}
            </h3>
            <div className="border-t border-[rgb(242_203_92/0.35)]">
              {c.voci.map((v) => (
                <Riga key={v.id} v={v} euro={euro} />
              ))}
            </div>
          </div>
        ))}
        <div className="mt-2 text-center">
          <a href={hrefMenu} className="btn-targhetta btn-targhetta-primario w-full">
            {vediTutto}
          </a>
        </div>
      </div>

      {/* Desktop: schede per categoria */}
      <div className="hidden sm:block">
        <div className="mb-[clamp(30px,4vw,44px)] flex flex-wrap justify-center gap-[10px]">
          {categorie.map((c) => {
            const sel = c.id === attiva
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setAttiva(c.id)}
                aria-pressed={sel}
                className={`font-testo cursor-pointer border px-[22px] py-[11px] text-[0.74rem] tracking-[0.2em] uppercase transition-colors ${
                  sel
                    ? 'bg-ambra border-ambra text-espresso'
                    : 'border-panna/35 text-panna hover:border-panna/70'
                }`}
              >
                {c.nome}
              </button>
            )
          })}
        </div>
        <div className="grid border-t border-[rgb(242_203_92/0.35)] sm:grid-cols-2 sm:gap-x-[clamp(40px,6vw,72px)]">
          {corrente.voci.map((v) => (
            <Riga key={v.id} v={v} euro={euro} />
          ))}
        </div>
      </div>
    </>
  )
}
