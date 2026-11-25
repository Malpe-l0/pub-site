import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, LogOut } from 'lucide-react'
import { richiediAdmin } from '@/lib/auth'
import { getImpostazioni } from '@/lib/dati'
import { Navigazione } from '@/components/admin/Navigazione'
import { esci } from '../azioni'
export const metadata: Metadata = { title: 'Gestione del sito', robots: { index: false } }
export default async function LayoutPannello({ children }: { children: React.ReactNode }) {
  const user=await richiediAdmin(),nome=getImpostazioni().nomePub||'Il tuo locale'
  return <div className="admin admin-shell">
    <a className="admin-skip" href="#contenuto-admin">Vai al contenuto</a>
    <header className="admin-topbar"><Link className="admin-brand" href="/admin"><strong>{nome}</strong><span>Gestione del sito</span></Link><div className="admin-topbar-actions"><span className="admin-user">{user.username}<span>{user.role==='owner'?'Titolare':'Collaboratore'}</span></span><Link className="admin-button secondario" href="/" target="_blank" rel="noopener noreferrer">Vedi il sito <ExternalLink size={15} aria-hidden="true"/></Link><form action={esci}><button className="admin-logout secondario"><LogOut size={16} aria-hidden="true"/> Esci</button></form></div></header>
    <aside className="admin-sidebar"><Navigazione owner={user.role==='owner'}/></aside>
    <main id="contenuto-admin" className="admin-content" tabIndex={-1}>{children}</main>
  </div>
}
