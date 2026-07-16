'use client'

import { useEffect, useRef } from 'react'

const CHIAVE_STORAGE = 'popup-avviso-chiuso'

/**
 * Avviso a tutto schermo (pausa estiva ecc.). Usa l'elemento nativo <dialog>:
 * overlay, centratura e chiusura con Esc funzionano senza CSS.
 * Una volta chiuso non riappare nella stessa sessione di navigazione, ma un
 * avviso con testo diverso viene mostrato di nuovo.
 */
export function Popup({
  titolo,
  messaggio,
  testoChiudi,
}: {
  titolo: string
  messaggio?: string
  testoChiudi: string
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const chiave = `${titolo}|${messaggio ?? ''}`

  useEffect(() => {
    if (sessionStorage.getItem(CHIAVE_STORAGE) !== chiave) {
      dialogo.current?.showModal()
    }
  }, [chiave])

  const ricordaChiusura = () => sessionStorage.setItem(CHIAVE_STORAGE, chiave)

  return (
    <dialog ref={dialogo} onClose={ricordaChiusura} aria-labelledby="popup-titolo">
      <h2 id="popup-titolo" className="font-titoli text-ambra-ink text-[1.7rem] leading-tight font-bold">
        {titolo}
      </h2>
      {messaggio && <p className="text-panna-2 mt-3">{messaggio}</p>}
      <form method="dialog" className="mt-5 text-right">
        <button className="btn-targhetta btn-targhetta-primario text-[0.95rem]">{testoChiudi}</button>
      </form>
    </dialog>
  )
}
