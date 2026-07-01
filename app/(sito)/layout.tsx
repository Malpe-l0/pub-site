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

  return (
    <div className="sito-taproom relative flex min-h-screen flex-col overflow-x-hidden">
      <NavTaproom nomePub={nome} />
      <main className="flex-1">{children}</main>

      <footer className="bg-espresso-3 text-[#d8cfbe]">
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] pt-[clamp(60px,7vw,92px)] pb-10">
          <div className="mb-[clamp(40px,5vw,60px)] flex flex-col items-center text-center">
            <img
              src="/taproom/crest.png"
              alt={`Stemma ${nome}`}
              className="mb-[22px] h-auto w-[118px]"
            />
            <p className="font-titoli text-panna text-[clamp(1.6rem,3.6vw,2.6rem)] text-balance">
              Fermati. Accomodati. Resta.
            </p>
          </div>

          <div className="grid gap-[clamp(32px,6vw,72px)] border-t border-[rgb(244_238_221/0.16)] pt-[clamp(40px,5vw,56px)] md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-titoli text-ambra-ink mb-[14px] text-[1.5rem]">{nome}</p>
              {impostazioni.indirizzo && (
                <p className="mb-[18px] text-[0.84rem] leading-[1.9]">{impostazioni.indirizzo}</p>
              )}
              {impostazioni.orari.length > 0 && (
                <p className="mb-[18px] text-[0.84rem] leading-[1.9]">
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
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(nome + ' ' + impostazioni.indirizzo)}`}
                target="_blank"
                rel="noopener"
                className="bg-ambra hover:bg-ambra-hover inline-flex items-center gap-[10px] px-[22px] py-[13px] text-[0.74rem] tracking-[0.18em] text-[#243a2d] uppercase transition-colors"
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

            <div className="flex flex-col gap-[11px]">
              <p className="text-ambra-ink mb-1 text-[0.68rem] tracking-[0.22em] uppercase">
                Contatti
              </p>
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
          </div>

          <p className="mt-[clamp(40px,5vw,60px)] text-center text-[0.72rem] tracking-[0.08em] text-[rgb(216_207_190/0.5)]">
            © {nome} · British Pub · Imola
          </p>
        </div>
      </footer>

      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} />}
    </div>
  )
}
