'use server'

import { headers } from 'next/headers'
import { getClassifica, inserisciPunteggio } from '@/lib/dati'
import { verificaTokenPartita, punteggioPlausibile, rateLimitSuperato } from '@/lib/gioco'
import type { Punteggio } from '@/lib/tipi'

export type EsitoInvio =
  | { esito: 'ok'; posizione: number; classifica: Punteggio[] }
  | { esito: 'errore'; messaggio: string }

/**
 * Salva un punteggio in classifica. Chiamata dal componente di gioco,
 * non da un form: riceve argomenti semplici e restituisce l'esito.
 */
export async function salvaPunteggio(
  token: string,
  sigla: string,
  punteggio: number,
  durataMs: number
): Promise<EsitoInvio> {
  const siglaPulita = String(sigla).toUpperCase().trim()
  if (!/^[A-Z]{3}$/.test(siglaPulita)) {
    return { esito: 'errore', messaggio: 'La sigla deve essere di tre lettere (A–Z).' }
  }

  if (verificaTokenPartita(String(token)) === null) {
    return { esito: 'errore', messaggio: 'Partita scaduta: ricarica la pagina e rigioca.' }
  }

  if (!punteggioPlausibile(Number(punteggio), Number(durataMs))) {
    return { esito: 'errore', messaggio: 'Punteggio non valido.' }
  }

  const intestazioni = await headers()
  const ip =
    intestazioni.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    intestazioni.get('x-real-ip') ||
    'sconosciuto'
  if (rateLimitSuperato(ip)) {
    return { esito: 'errore', messaggio: 'Troppi invii ravvicinati: riprova tra un minuto.' }
  }

  const posizione = inserisciPunteggio(siglaPulita, Number(punteggio))
  return { esito: 'ok', posizione, classifica: getClassifica() }
}
