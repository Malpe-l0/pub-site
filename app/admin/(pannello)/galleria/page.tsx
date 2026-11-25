import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { getGalleria } from '@/lib/dati'
import { getStatoInstagram,getFotoInstagram,getConfigGalleria } from '@/lib/instagram'
import {StatoInstagram} from '@/components/admin/StatoInstagram'
import {Submit} from '@/components/admin/Submit'
import {caricaFoto,aggiornaFoto,eliminaFotoGalleria,aggiornaFonte,visibilitaInstagram} from './azioni'
export default async function PaginaGalleriaAdmin({searchParams}:{searchParams:Promise<{salvato?:string}>}) {
  const user=await richiediAdmin(),foto=getGalleria(),ig=getStatoInstagram(),post=getFotoInstagram(),config=getConfigGalleria(),q=await searchParams
  return <>
    <div className="admin-page-heading"><h1>Galleria</h1><p>Scegli quali immagini mostrare sul sito e da dove prenderle.</p></div>
    {q.salvato&&<p role="status" className="admin-notice success">Preferenze salvate.</p>}
    <section className="admin-panel"><h2>Foto da mostrare sul sito</h2><form action={aggiornaFonte}>
      <label>Origine delle foto<select name="fonte" defaultValue={config.fonte}><option value="automatica">Instagram, con foto manuali se la cache è vuota</option><option value="manuale">Solo foto caricate a mano</option><option value="instagram">Solo Instagram</option><option value="mista">Foto manuali e Instagram insieme</option></select></label>
      <p className="admin-help">Se Instagram non risponde, le foto già importate rimangono disponibili. In modalità mista, le foto manuali compaiono per prime.</p>
      <label><input type="checkbox" name="includiReel" defaultChecked={config.includiReel}/> Importa anche le copertine dei video e dei Reel</label><p className="admin-help">La preferenza viene applicata alla prossima sincronizzazione. I video non vengono riprodotti sul sito.</p><Submit>Salva preferenze</Submit>
    </form></section>
    <section className="admin-panel"><div className="admin-section-heading"><h2>Foto caricate a mano <span className="admin-count">{foto.length}</span></h2></div><p>Aggiungi fino a 5 immagini per volta, da massimo 8 MB ciascuna.</p>
      <form action={caricaFoto} className="admin-upload"><label>Seleziona immagini<input type="file" name="foto" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" multiple required/></label><Submit pending="Caricamento immagini…">Carica foto</Submit></form>
      {!foto.length?<div className="admin-empty"><strong>Aggiungi le prime foto del locale</strong><p>Carica immagini del bancone, della sala o delle tue specialità.</p></div>:<div className="admin-photo-grid">{foto.map(f=><article key={f.id} className="admin-photo"><img src={`/uploads/${f.file}`} alt={f.didascalia||'Foto caricata del locale'} loading="lazy"/><div><form action={aggiornaFoto}><input type="hidden" name="id" value={f.id}/><label>Didascalia<input name="didascalia" defaultValue={f.didascalia} placeholder="Es. Il nostro bancone" maxLength={5000}/></label><label>Ordine di visualizzazione<input type="number" name="ordine" defaultValue={f.ordine} min={0}/></label><Submit className="secondario">Salva foto</Submit></form><details className="pericolo"><summary>Elimina foto</summary><p>La foto verrà rimossa dalla galleria del sito.</p><form action={eliminaFotoGalleria}><input type="hidden" name="id" value={f.id}/><Submit>Conferma eliminazione</Submit></form></details></div></article>)}</div>}
    </section>
    <section className="admin-panel"><div className="admin-section-heading"><h2>Foto da Instagram <span className="admin-count">{post.length}</span></h2><StatoInstagram stato={ig.stato}/></div><p>Importiamo fino a 9 foto o copertine recenti. Ogni carosello contribuisce con la sua copertina. Puoi nascondere le immagini che non vuoi mostrare.</p>{user.role==='owner'&&<p><Link href="/admin/instagram">Gestisci il collegamento e sincronizza le foto →</Link></p>}
      {!post.length?<div className="admin-empty"><p>{ig.configurato?'Nessuna foto importata. Avvia una sincronizzazione dalla sezione Instagram.':'Collega Instagram per importare le foto, oppure usa quelle caricate a mano.'}</p></div>:<div className="admin-photo-grid">{post.map(f=><article key={f.id} className="admin-photo"><img src={`/uploads/${f.file}`} alt={f.didascalia||'Foto Instagram del locale'} loading="lazy"/><div><span className={`admin-badge ${f.nascosta?'':'success'}`}>{f.nascosta?'Nascosta dal sito':'Inclusa nella selezione Instagram'}</span><p className="admin-caption">{f.didascalia||'Senza didascalia'}</p><form action={visibilitaInstagram}><input type="hidden" name="id" value={f.id}/><input type="hidden" name="nascosta" value={f.nascosta?'0':'1'}/><Submit className="secondario">{f.nascosta?'Mostra foto':'Nascondi foto'}</Submit></form></div></article>)}</div>}
    </section>
  </>
}
