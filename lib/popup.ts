import type { Popup } from '@/lib/tipi'
import { oggiInItalia } from './dataora'

/**
 * Decide lato server se il pop-up va mostrato: deve essere attivo, avere un
 * titolo e — se sono impostate le date — oggi deve cadere nell'intervallo
 * (date confrontate nel fuso orario italiano).
 */
export function popupDaMostrare(popup: Popup) {
  if (!popup.attivo || !popup.titolo) return null

  const oggi = oggiInItalia()
  if (popup.dataInizio && oggi < popup.dataInizio) return null
  if (popup.dataFine && oggi > popup.dataFine) return null

  return { titolo: popup.titolo, messaggio: popup.messaggio || undefined }
}
