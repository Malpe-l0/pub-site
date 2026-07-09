'use client'

import { useState } from 'react'
import type { CategoriaConVoci } from '@/lib/tipi'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

/** La carta a schede: una scheda per categoria del pannello, voci dal DB. */
export function CartaMenu({ categorie }: { categorie: CategoriaConVoci[] }) {
  const [attiva, setAttiva] = useState(categorie[0].id)
  const corrente = categorie.find((c) => c.id === attiva) ?? categorie[0]

  return (
    <>
      {/* Mobile: striscia orizzontale scrollabile (le tab su una riga, si scorre
          col pollice) invece della pila a scaletta del flex-wrap. Da sm: wrap centrato. */}
      <div className="mb-[clamp(30px,4vw,44px)] flex gap-[10px] overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        {categorie.map((c) => {
          const sel = c.id === attiva
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setAttiva(c.id)}
              aria-pressed={sel}
              className={`font-testo shrink-0 cursor-pointer border px-[22px] py-[11px] text-[0.74rem] whitespace-nowrap tracking-[0.2em] uppercase transition-colors ${
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
          <div
            key={v.id}
            className="flex items-baseline gap-[14px] border-b border-[rgb(244_238_221/0.18)] px-[2px] py-[15px]"
          >
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="font-titoli text-panna text-[1.06rem]">{v.nome}</span>
              {v.descrizione && (
                <span className="font-testo text-[0.82rem] text-[#c2dccd] italic">
                  {v.descrizione}
                </span>
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
        ))}
      </div>
    </>
  )
}
