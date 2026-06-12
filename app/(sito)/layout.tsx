import Link from 'next/link'
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
    <div className="flex min-h-screen flex-col">
      <Navigazione
        nomePub={impostazioni.nomePub || 'Il nostro pub'}
        stile={impostazioni.stileSito}
        mostraGalleria={mostraGalleria}
        mostraEventi={mostraEventi}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">{children}</main>
      <footer id="contatti" className="bg-verde text-crema mt-auto">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div className="space-y-1">
            {impostazioni.indirizzo && <p>{impostazioni.indirizzo}</p>}
            {impostazioni.telefono && (
              <p>
                <a
                  className="hover:text-oro underline"
                  href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                >
                  {impostazioni.telefono}
                </a>
              </p>
            )}
            {impostazioni.email && (
              <p>
                <a className="hover:text-oro underline" href={`mailto:${impostazioni.email}`}>
                  {impostazioni.email}
                </a>
              </p>
            )}
          </div>
          {impostazioni.orari.length > 0 && (
            <section aria-label="Orari di apertura">
              <h2 className="font-titoli text-oro mb-2 text-xl">Orari</h2>
              <ul className="space-y-1">
                {impostazioni.orari.map((fascia, indice) => (
                  <li key={indice}>
                    {fascia.giorni}: {fascia.orario}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <ul className="space-y-1">
            {impostazioni.facebook && (
              <li>
                <a className="hover:text-oro underline" href={impostazioni.facebook}>
                  Facebook
                </a>
              </li>
            )}
            {impostazioni.instagram && (
              <li>
                <a className="hover:text-oro underline" href={impostazioni.instagram}>
                  Instagram
                </a>
              </li>
            )}
            <li>
              <Link className="hover:text-oro underline" href="/gioco">
                La spillata perfetta
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} />}
    </div>
  )
}
