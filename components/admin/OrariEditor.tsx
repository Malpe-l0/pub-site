'use client'

import { useState } from 'react'
import type { FasciaOraria } from '@/lib/tipi'

/**
 * Righe di orario modificabili (giorni + orario) dentro il form impostazioni.
 * I valori viaggiano nel form come campi ripetuti "giorni" e "orario".
 */
export function OrariEditor({ iniziali }: { iniziali: FasciaOraria[] }) {
  const [fasce, setFasce] = useState<FasciaOraria[]>(iniziali)

  const aggiorna = (indice: number, campo: keyof FasciaOraria, valore: string) =>
    setFasce(fasce.map((fascia, i) => (i === indice ? { ...fascia, [campo]: valore } : fascia)))

  return (
    <fieldset>
      <legend>Orari di apertura</legend>
      {fasce.map((fascia, indice) => (
        <p key={indice}>
          <input
            name="giorni"
            aria-label="Giorni"
            placeholder="Lunedì – Giovedì"
            value={fascia.giorni}
            onChange={(e) => aggiorna(indice, 'giorni', e.target.value)}
          />
          <input
            name="orario"
            aria-label="Orario"
            placeholder="18:00 – 01:00"
            value={fascia.orario}
            onChange={(e) => aggiorna(indice, 'orario', e.target.value)}
          />
          <button type="button" onClick={() => setFasce(fasce.filter((_, i) => i !== indice))}>
            Togli riga
          </button>
        </p>
      ))}
      <button type="button" onClick={() => setFasce([...fasce, { giorni: '', orario: '' }])}>
        Aggiungi riga
      </button>
    </fieldset>
  )
}
