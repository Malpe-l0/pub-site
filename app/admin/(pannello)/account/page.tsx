import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { aggiornaPassword, disconnettiTutti, creaUtente, modificaUtente } from './azioni'

const nomeEvento = (event: string) => {
  const eventi: Record<string,string> = {
    'login.uscita':'Uscita effettuata','login.fallito':'Accesso non riuscito','login.riuscito':'Accesso effettuato',
    'account.inizializzato':'Primo titolare creato','account.password_cambiata':'Password cambiata',
    'account.sessioni_revocate':'Dispositivi disconnessi','account.utente_creato':'Account creato',
    'account.utente_aggiornato':'Account aggiornato','account.recuperato_da_console':'Accesso recuperato',
    'sito.aspetto_aggiornato':'Aspetto e contenuti aggiornati','sito.impostazioni_aggiornate':'Impostazioni aggiornate',
  }
  if (eventi[event]) return eventi[event]
  const azione = event.split('.')[1] || ''
  const sezione: Record<string,string> = {menu:'Menu',eventi:'Eventi',servizi:'Servizi',galleria:'Galleria',popup:'Avvisi'}
  return `${sezione[event.split('.')[0]] || 'Contenuti'}: ${azione.startsWith('elimina') ? 'eliminazione' : azione.startsWith('crea') || azione.startsWith('carica') ? 'aggiunta' : 'aggiornamento'}`
}
const errori: Record<string, string> = {
  password: 'La password attuale non è corretta.', nuova: 'Usa da 12 a 128 caratteri e ripeti la stessa password.',
  utente: 'Controlla il nome utente (3–64 lettere, numeri, punti, trattini) e la password. Il nome deve essere disponibile.',
  seStesso: 'Puoi cambiare la tua password nel modulo dedicato. Il tuo account resta attivo.', permessi: 'Questa funzione è riservata al titolare.',
}
export default async function Account({ searchParams }: { searchParams: Promise<{ errore?: string; salvato?: string }> }) {
  const user = await richiediAdmin()
  const query = await searchParams
  const sessions = db.prepare('SELECT count(*) AS n FROM admin_sessions WHERE user_id=? AND expires_at>unixepoch()*1000 AND last_seen>(unixepoch()-86400)*1000').get(user.id) as { n: number }
  const users = user.role === 'owner' ? db.prepare('SELECT id,username,role,active FROM admin_users ORDER BY id').all() as { id: number; username: string; role: string; active: number }[] : []
  const logs = user.role === 'owner' ? db.prepare('SELECT a.id,a.event,a.created_at,u.username FROM audit_log a LEFT JOIN admin_users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 40').all() as { id: number; event: string; created_at: number; username: string | null }[] : []
  return <>
    <h1>Account e accessi</h1>
    <p>Accesso come <strong>{user.username}</strong> · {user.role === 'owner' ? 'Titolare' : 'Collaboratore'}</p>
    {query.errore && <p role="alert">{errori[query.errore] || 'Controlla i dati inseriti.'}</p>}
    {query.salvato && <p role="status">Modifiche salvate.</p>}
    <h2>Cambia password</h2>
    <p>Usa almeno 12 caratteri. Dopo il cambio, gli altri dispositivi saranno disconnessi.</p>
    <form action={aggiornaPassword}>
      <label>Password attuale<input name="attuale" type="password" autoComplete="current-password" required maxLength={128} /></label>
      <label>Nuova password<input name="nuova" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>
      <label>Ripeti la nuova password<input name="conferma" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>
      <button>Salva password</button>
    </form>
    <h2>Dispositivi collegati</h2><p>{sessions.n} sessioni attive. L’accesso scade dopo 7 giorni o 24 ore di inattività.</p>
    <form action={disconnettiTutti}><button className="secondario">Disconnetti tutti i dispositivi, incluso questo</button></form>
    {user.role === 'owner' && <>
      <h2>Persone con accesso</h2><p>I collaboratori gestiscono i contenuti. I titolari gestiscono anche account, identità del sito e collegamenti esterni.</p>
      {users.map(u => <section key={u.id} className="border-t py-4">
        <h3>{u.username} · {u.role === 'owner' ? 'Titolare' : 'Collaboratore'}</h3>
        {u.id !== user.id && <form action={modificaUtente}>
          <input type="hidden" name="id" value={u.id} />
          <label><input type="checkbox" name="attivo" defaultChecked={Boolean(u.active)} /> Accesso abilitato</label>
          <label>Reimposta password (facoltativo)<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} /></label>
          <button>Salva e disconnetti i dispositivi</button>
        </form>}
      </section>)}
      <h3>Aggiungi una persona</h3><form action={creaUtente}>
        <label>Nome utente<input name="username" required minLength={3} maxLength={64} autoComplete="off" pattern="[a-zA-Z0-9._\-]+" /></label>
        <label>Password iniziale<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>
        <label>Permessi<select name="ruolo"><option value="editor">Collaboratore</option><option value="owner">Titolare</option></select></label><button>Crea account</button>
      </form>
      <h2>Attività recenti</h2><div className="overflow-x-auto"><table><caption className="sr-only">Ultime operazioni amministrative</caption><thead><tr><th>Quando</th><th>Persona</th><th>Operazione</th></tr></thead><tbody>{logs.map(l => <tr key={l.id}><td>{new Date(l.created_at).toLocaleString('it-IT')}</td><td>{l.username || 'Accesso pubblico'}</td><td>{nomeEvento(l.event)}</td></tr>)}</tbody></table></div>
    </>}
  </>
}
