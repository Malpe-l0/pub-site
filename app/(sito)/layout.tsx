import { getImpostazioni, getPopup, getGalleria, getEventiFuturi } from '@/lib/dati'
import { popupDaMostrare } from '@/lib/popup'
import { Navigazione } from '@/components/Navigazione'
import { Popup } from '@/components/Popup'

// Pagine dinamiche: ogni richiesta legge il database, così le modifiche dal
// pannello (e le logiche a date di pop-up ed eventi) sono subito visibili.
export const dynamic = 'force-dynamic'

// Layout delle pagine pubbliche: header, footer e pop-up.
// Il pannello /admin è fuori da questo gruppo e ha il suo layout.
export default async function LayoutSito({ children }: { children: React.ReactNode }) {
  const impostazioni = getImpostazioni()
  const avviso = popupDaMostrare(getPopup())
  const mostraGalleria = getGalleria().length > 0
  const mostraEventi = getEventiFuturi().length > 0

  return (
    <>
      <Navigazione
        nomePub={impostazioni.nomePub || 'Il nostro pub'}
        stile={impostazioni.stileSito}
        mostraGalleria={mostraGalleria}
        mostraEventi={mostraEventi}
      />
      <main>{children}</main>
      <footer id="contatti">
        {impostazioni.indirizzo && <p>{impostazioni.indirizzo}</p>}
        {impostazioni.telefono && (
          <p>
            <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}>
              {impostazioni.telefono}
            </a>
          </p>
        )}
        {impostazioni.email && (
          <p>
            <a href={`mailto:${impostazioni.email}`}>{impostazioni.email}</a>
          </p>
        )}
        {impostazioni.orari.length > 0 && (
          <section aria-label="Orari di apertura">
            <h2>Orari</h2>
            <ul>
              {impostazioni.orari.map((fascia, indice) => (
                <li key={indice}>
                  {fascia.giorni}: {fascia.orario}
                </li>
              ))}
            </ul>
          </section>
        )}
        <ul>
          {impostazioni.facebook && (
            <li>
              <a href={impostazioni.facebook}>Facebook</a>
            </li>
          )}
          {impostazioni.instagram && (
            <li>
              <a href={impostazioni.instagram}>Instagram</a>
            </li>
          )}
        </ul>
      </footer>
      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} />}
    </>
  )
}
