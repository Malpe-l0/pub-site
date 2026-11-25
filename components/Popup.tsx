'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

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
      <h2 id="popup-titolo" className="text-lg font-semibold tracking-tight">
        {titolo}
      </h2>
      {messaggio && <p className="text-muted-foreground mt-2 text-sm leading-6">{messaggio}</p>}
      <form method="dialog" className="mt-6 flex justify-end">
        <Button type="submit">{testoChiudi}</Button>
      </form>
    </dialog>
  )
}
