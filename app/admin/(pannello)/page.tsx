import Link from 'next/link'
import {ArrowRight, Utensils, Images, CalendarDays, Megaphone} from 'lucide-react'
import {richiediAdmin} from '@/lib/auth'
import {getImpostazioni,getMenuCompleto,getEventiFuturi,getGalleriaPubblica} from '@/lib/dati'
import {getStatoInstagram,getStatoWorker} from '@/lib/instagram'
import {popupDaMostrare} from '@/lib/popup'
import {getPopup} from '@/lib/dati'
import {StatoInstagram,dataAdmin} from '@/components/admin/StatoInstagram'
export default async function PaginaPannello(){
  const user=await richiediAdmin(),i=getImpostazioni(),ig=getStatoInstagram(),worker=getStatoWorker()
  const mancanti=[!i.orari.length&&'gli orari di apertura',!i.indirizzo&&'l’indirizzo',!(i.telefono||i.email||i.instagram||i.facebook)&&'un contatto'].filter(Boolean)
  const attivita=[
    {href:'/admin/menu',nome:'Aggiorna il menu',testo:'Piatti, bevande, prezzi e disponibilità.',dato:`${getMenuCompleto().reduce((n,c)=>n+c.voci.length,0)} voci`,Icon:Utensils},
    {href:'/admin/galleria',nome:'Gestisci le foto',testo:'Scegli le immagini da mostrare sul sito.',dato:`${getGalleriaPubblica().foto.length} ${getGalleriaPubblica().foto.length===1?'foto visibile':'foto visibili'}`,Icon:Images},
    {href:'/admin/eventi',nome:'Organizza gli eventi',testo:'Aggiungi una serata o aggiorna il programma.',dato:`${getEventiFuturi().length} in programma`,Icon:CalendarDays},
    {href:'/admin/popup',nome:'Pubblica un avviso',testo:'Comunica chiusure, novità e variazioni.',dato:popupDaMostrare(getPopup())?'Visibile ora':'Nessun avviso visibile',Icon:Megaphone},
  ]
  return <><div className="admin-page-heading"><h1>Panoramica</h1><p>Le informazioni del sito e le attività di tutti i giorni, in un solo posto.</p></div>
    {mancanti.length>0&&<div className="admin-notice warning"><strong>Completa le informazioni del locale</strong><p>Mancano {mancanti.join(', ')}.{user.role==='owner'?<> <Link href="/admin/impostazioni">Aggiungi le informazioni</Link>.</>:' Chiedi al titolare di aggiungerle.'}</p></div>}
    <section className="admin-panel"><h2>Cosa vuoi aggiornare?</h2><div className="admin-task-list">{attivita.map(({href,nome,testo,dato,Icon})=><Link href={href} key={href}><Icon size={22} aria-hidden="true"/><div><strong>{nome}</strong><span>{testo}</span></div><span className="admin-task-data">{dato}</span><ArrowRight size={18} aria-hidden="true"/></Link>)}</div></section>
    <section className="admin-panel"><h2>Collegamenti e aggiornamenti</h2><div className="admin-connection-row"><div><strong>Instagram {ig.username&&`· @${ig.username}`}</strong><p>Ultime foto importate: {dataAdmin(ig.ultimaSync)}</p></div><StatoInstagram stato={ig.stato}/>{user.role==='owner'&&<Link href="/admin/instagram">Gestisci collegamento</Link>}</div>{(!worker.attivo||worker.errore)&&<div className="admin-notice warning"><strong>{worker.attivo?'Un aggiornamento automatico richiede attenzione':'Aggiornamenti automatici da verificare'}</strong><p>{worker.errore||'Il servizio automatico non risulta attivo di recente. Le modifiche manuali continuano a funzionare.'} {user.role==='owner'&&<Link href="/admin/instagram">Vedi lo stato</Link>}</p></div>}</section>
    {user.role==='owner'&&<p className="admin-help">Devi cambiare logo, colori o testi? Vai ad <Link href="/admin/aspetto">Aspetto e testi</Link>. Per contatti e orari, apri <Link href="/admin/impostazioni">Informazioni del locale</Link>.</p>}
  </>
}
