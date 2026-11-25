import type {StatoInstagram as Stato} from '@/lib/tipi'
export function StatoInstagram({stato}:{stato:Stato['stato']}) {
  const labels={scollegato:'Non collegato',collegato:'Collegamento verificato',ricollega:'Da ricollegare',errore:'Aggiornamento non riuscito',da_verificare:'Da verificare'}
  return <span className={`admin-badge ${stato==='collegato'?'success':stato==='scollegato'?'':'warning'}`}>{labels[stato]}</span>
}
export function dataAdmin(value:string|number|null) {
  return value?new Date(value).toLocaleString('it-IT',{timeZone:'Europe/Rome',dateStyle:'medium',timeStyle:'short'}):'Non ancora disponibile'
}
