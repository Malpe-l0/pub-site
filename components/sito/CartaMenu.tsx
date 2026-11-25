'use client'

import { useId, useState } from 'react'
import type { CategoriaConVoci, VoceMenu } from '@/lib/tipi'

function Riga({ v, euro }: { v: VoceMenu; euro: Intl.NumberFormat }) {
  return (
    <li className="pub-menu-item">
      <div className="pub-menu-item-top"><h4>{v.nome}</h4><span aria-hidden className="pub-menu-dots" /><span className="pub-price">{euro.format(v.prezzoCentesimi / 100)}</span></div>
      {v.descrizione && <p>{v.descrizione}</p>}
    </li>
  )
}

export function CartaMenu({ categorie, locale, vediTutto, hrefMenu }: {
  categorie: CategoriaConVoci[]
  locale: string
  vediTutto: string
  hrefMenu: string
}) {
  const [attiva, setAttiva] = useState(categorie[0]?.id)
  const id = useId()
  const corrente = categorie.find((c) => c.id === attiva) ?? categorie[0]
  if (!corrente) return null
  const euro = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })

  return (
    <div className="pub-menu-preview">
      <div className="pub-categories" role="group" aria-label={locale.startsWith('it') ? 'Categorie del menu' : 'Menu categories'}>
        {categorie.map((c) => <button key={c.id} type="button" aria-pressed={c.id === corrente.id} aria-controls={`${id}-content`} onClick={() => setAttiva(c.id)}>{c.nome}</button>)}
      </div>
      <section id={`${id}-content`} aria-labelledby={`${id}-title`}>
        <h3 id={`${id}-title`} className="pub-menu-category-title">{corrente.nome}</h3>
        <ul className="pub-menu-rows">{corrente.voci.map((v) => <Riga key={v.id} v={v} euro={euro} />)}</ul>
      </section>
      <div className="pub-menu-more"><a href={hrefMenu} className="pub-button pub-button-outline">{vediTutto}<span aria-hidden>→</span></a></div>
    </div>
  )
}
