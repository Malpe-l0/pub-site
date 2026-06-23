import { richiediAdmin } from '@/lib/auth'
import { getConfigInstagram, getPostInstagram } from '@/lib/instagram'
import { salvaInstagram, aggiornaInstagram } from './azioni'

// aggiornato_il è UTC (datetime('now') di SQLite): si mostra in ora italiana.
const formato = new Intl.DateTimeFormat('it-IT', {
  timeZone: 'Europe/Rome',
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default async function PaginaInstagramAdmin({
  searchParams,
}: {
  searchParams: Promise<{ salvato?: string; sync?: string }>
}) {
  await richiediAdmin()
  const config = getConfigInstagram()
  const post = getPostInstagram(100)
  const { salvato, sync } = await searchParams

  return (
    <>
      <h1>Post di Instagram</h1>
      {salvato && <p role="status">Impostazioni salvate.</p>}
      {sync === 'ok' && <p role="status">Post aggiornati dal profilo.</p>}
      {sync === 'errore' && (
        <p role="alert" className="pericolo">
          Aggiornamento non riuscito: {config.ultimoErrore || 'errore sconosciuto'}
        </p>
      )}

      <p>
        Mostra in homepage gli ultimi post del tuo profilo Instagram (serve un account{' '}
        <strong>Business</strong> o <strong>Creator</strong>). Incolla una volta il token di
        accesso a lunga scadenza: il sito lo rinnova da solo prima che scada e rinfresca i post man
        mano che il sito viene visitato.
      </p>

      <form action={salvaInstagram}>
        <p>
          <label>
            <input type="checkbox" name="attivo" defaultChecked={config.attivo} /> Mostra i post sul
            sito
          </label>
        </p>
        <p>
          <label>
            Token di accesso{' '}
            {config.token && '(già impostato — lascia vuoto per non cambiarlo)'}
            <input
              type="password"
              name="token"
              autoComplete="off"
              placeholder={config.token ? '••••••••••••' : 'Incolla qui il token'}
            />
          </label>
        </p>
        <button>Salva</button>
      </form>

      <form action={aggiornaInstagram} className="mt-4">
        <button>Aggiorna adesso</button>
      </form>

      <ul className="mt-4">
        <li>Profilo: {config.username ? '@' + config.username : '—'}</li>
        <li>Post in cache: {post.length}</li>
        <li>
          Ultimo aggiornamento:{' '}
          {config.aggiornatoIl ? formato.format(new Date(config.aggiornatoIl + 'Z')) : 'mai'}
        </li>
        <li>
          Scadenza token (stima):{' '}
          {config.tokenScadenza ? formato.format(new Date(config.tokenScadenza)) : '—'}
        </li>
        {config.ultimoErrore && (
          <li className="pericolo">Ultimo errore: {config.ultimoErrore}</li>
        )}
      </ul>

      <details className="mt-6">
        <summary>Come ottenere il token (account Business/Creator)</summary>
        <ol>
          <li>
            Assicurati che il profilo Instagram sia di tipo <strong>Business</strong> o{' '}
            <strong>Creator</strong> (dall’app: Impostazioni → Tipo di account).
          </li>
          <li>
            Vai su <em>developers.facebook.com</em>, crea un’app e aggiungi il prodotto{' '}
            <strong>Instagram</strong> (“API di Instagram con login di Instagram”).
          </li>
          <li>
            Collega il tuo account Instagram e genera un <strong>token di accesso</strong>,
            poi convertilo in un <strong>token a lunga scadenza</strong> (dura circa 60 giorni).
          </li>
          <li>Incolla quel token qui sopra, spunta “Mostra i post” e salva.</li>
          <li>
            Premi <strong>Aggiorna adesso</strong>: se è tutto a posto vedrai comparire i post qui
            sotto e in homepage.
          </li>
        </ol>
        <p>
          Nota: la procedura esatta sul sito di Meta può cambiare nel tempo. Il token va rigenerato
          solo se il sito resta spento per oltre due mesi (in quel caso il rinnovo automatico non
          scatta e qui comparirà un errore).
        </p>
      </details>

      {post.length > 0 && (
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {post.map((p) => (
            <li key={p.id}>
              <a href={p.permalink} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbnailUrl || p.mediaUrl}
                  alt={p.caption ? p.caption.slice(0, 80) : ''}
                  style={{ aspectRatio: '1 / 1', objectFit: 'cover', width: '100%' }}
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
