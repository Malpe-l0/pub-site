import { getImpostazioni, getPopup } from '@/lib/dati'
import { popupDaMostrare } from '@/lib/popup'
import { NavTaproom } from '@/components/sito/NavTaproom'
import { Popup } from '@/components/Popup'

// Pagine dinamiche: ogni richiesta legge il database, così le modifiche dal
// pannello (e le logiche a date di pop-up ed eventi) sono subito visibili.
export const dynamic = 'force-dynamic'

// Layout del sito pubblico "Taproom": nav sovrapposta all'hero, footer #dove, pop-up.
// Il marker .sito-taproom fa virare lo sfondo della pagina sullo scuro (vedi globals.css).
export default async function LayoutSito({ children }: { children: React.ReactNode }) {
  const impostazioni = getImpostazioni()
  const avviso = popupDaMostrare(getPopup())
  const nome = impostazioni.nomePub || 'Il nostro pub'
  // Le colonne del footer esistono solo se hanno qualcosa da mostrare:
  // un'etichetta o un divisore sopra il nulla è peggio di nessuna colonna.
  const haDove = Boolean(impostazioni.indirizzo || impostazioni.orari.length > 0)
  const haContatti = Boolean(
    impostazioni.telefono || impostazioni.instagram || impostazioni.facebook || impostazioni.email
  )

  return (
    <div className="sito-taproom relative flex min-h-screen flex-col overflow-x-hidden">
      <NavTaproom nomePub={nome} />
      <main className="flex-1">{children}</main>

      <footer className="bg-espresso-3 border-ambra/25 text-[#d8cfbe] border-t">
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] pt-[clamp(60px,7vw,92px)] pb-10">
          <div className="mb-[clamp(40px,5vw,60px)] flex flex-col items-center text-center">
            <p className="font-titoli text-ambra-ink text-[clamp(1.9rem,4vw,2.7rem)] font-semibold tracking-[0.01em]">
              {nome}
            </p>
            <div className="mt-[18px] flex items-center gap-[clamp(14px,3vw,26px)]">
              <span className="bg-ambra/40 h-px w-[clamp(28px,6vw,64px)]" />
              <p className="font-titoli text-panna text-[clamp(1.3rem,2.8vw,1.9rem)] text-balance">
                Fermati. Accomodati. Resta.
              </p>
              <span className="bg-ambra/40 h-px w-[clamp(28px,6vw,64px)]" />
            </div>
          </div>

          {/* Direttorio: colonne a larghezza fissa (auto-fit, nessun breakpoint
              manuale sul numero di colonne), separate da hairline che cambiano
              lato (sopra da impilate, a sinistra in riga) solo per orientamento. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,320px))] gap-x-[clamp(32px,5vw,56px)] gap-y-[clamp(28px,4vw,36px)] border-t border-[rgb(244_238_221/0.16)] pt-[clamp(40px,5vw,56px)]">
            {haDove && (
              <div className="border-[rgb(244_238_221/0.14)] first:border-t-0 first:pt-0 first:sm:border-l-0 first:sm:pl-0 border-t pt-[clamp(24px,3vw,32px)] sm:border-t-0 sm:border-l sm:pt-0 sm:pl-[clamp(28px,4vw,44px)]">
                {impostazioni.indirizzo && (
                  <p className="mb-[10px] text-[0.84rem] leading-[1.9]">{impostazioni.indirizzo}</p>
                )}
                {impostazioni.orari.length > 0 && (
                  <p className="text-[0.84rem] leading-[1.9]">
                    {impostazioni.orari.map((fascia, i) => (
                      <span key={i}>
                        {fascia.giorni}
                        {fascia.giorni && fascia.orario ? ' ' : ''}
                        {fascia.orario}
                        {i < impostazioni.orari.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}

            <div className="border-[rgb(244_238_221/0.14)] first:border-t-0 first:pt-0 first:sm:border-l-0 first:sm:pl-0 border-t pt-[clamp(24px,3vw,32px)] sm:border-t-0 sm:border-l sm:pt-0 sm:pl-[clamp(28px,4vw,44px)]">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(nome + ' ' + impostazioni.indirizzo)}`}
                target="_blank"
                rel="noopener"
                className="btn-targhetta btn-targhetta-primario inline-flex w-full max-w-full items-center justify-center gap-[10px] sm:w-auto"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#243a2d"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Indicazioni su Maps
              </a>
            </div>

            {haContatti && (
              <div className="border-[rgb(244_238_221/0.14)] first:border-t-0 first:pt-0 first:sm:border-l-0 first:sm:pl-0 flex border-t flex-col gap-[11px] pt-[clamp(24px,3vw,32px)] sm:border-t-0 sm:border-l sm:pt-0 sm:pl-[clamp(28px,4vw,44px)]">
                {impostazioni.telefono && (
                  <a
                    className="hover:text-panna text-[0.84rem] transition-colors"
                    href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                  >
                    {impostazioni.telefono}
                  </a>
                )}
                {impostazioni.instagram && (
                  <a className="hover:text-panna text-[0.84rem] transition-colors" href={impostazioni.instagram}>
                    Instagram
                  </a>
                )}
                {impostazioni.facebook && (
                  <a className="hover:text-panna text-[0.84rem] transition-colors" href={impostazioni.facebook}>
                    Facebook
                  </a>
                )}
                {impostazioni.email && (
                  <a
                    className="hover:text-panna text-[0.84rem] transition-colors"
                    href={`mailto:${impostazioni.email}`}
                  >
                    {impostazioni.email}
                  </a>
                )}
              </div>
            )}
          </div>

          <p className="text-panna-4 mt-[clamp(40px,5vw,60px)] text-center text-[0.78rem] tracking-[0.08em]">
            © {nome} · British Pub · Imola
          </p>
        </div>
      </footer>

      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} />}
    </div>
  )
}
