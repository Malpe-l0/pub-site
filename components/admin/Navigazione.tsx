'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Utensils, CalendarDays, Images, PanelsTopLeft, Megaphone, Settings, Paintbrush, Users, Camera, Menu, X } from 'lucide-react'
const gruppi=[
  {nome:'Gestione quotidiana',voci:[['/admin','Panoramica',LayoutDashboard],['/admin/menu','Menu',Utensils],['/admin/eventi','Eventi',CalendarDays],['/admin/galleria','Galleria',Images],['/admin/popup','Avvisi sul sito',Megaphone],['/admin/servizi','Servizi',PanelsTopLeft]]},
  {nome:'Configurazione',voci:[['/admin/impostazioni','Informazioni del locale',Settings],['/admin/aspetto','Aspetto e testi',Paintbrush],['/admin/instagram','Instagram',Camera],['/admin/account','Account e accessi',Users]]},
] as const
export function Navigazione({owner}:{owner:boolean}) {
  const pathname=usePathname(),[aperto,setAperto]=useState(false)
  return <>
    <button type="button" className="admin-menu-toggle secondario" aria-expanded={aperto} aria-controls="admin-navigation" onClick={()=>setAperto(!aperto)}>{aperto?<X size={18}/>:<Menu size={18}/>} Menu di gestione</button>
    <nav id="admin-navigation" className={`admin-navigation ${aperto?'is-open':''}`} aria-label="Gestione del sito">
      {gruppi.map(g=><div className="admin-nav-group" key={g.nome}><p>{g.nome}</p><ul>{g.voci.filter(([href])=>owner||!['/admin/impostazioni','/admin/aspetto','/admin/instagram'].includes(href)).map(([href,label,Icon])=>{
        const active=href==='/admin'?pathname===href:pathname.startsWith(href)
        return <li key={href}><Link href={href} aria-current={active?'page':undefined} onClick={()=>setAperto(false)}><Icon size={18} aria-hidden="true"/>{label}</Link></li>
      })}</ul></div>)}
    </nav>
  </>
}
