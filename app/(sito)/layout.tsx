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

      <footer id="dove" className="isola-notte bg-espresso-3 border-ambra scroll-mt-24 border-t-[3px]">
        <div className="mx-auto max-w-[1200px] px-[clamp(24px,5vw,40px)] pt-[clamp(60px,8vw,100px)] pb-11">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <h2 className="font-titoli text-ambra-ink text-[1.9rem] font-bold uppercase">{nome}</h2>
              <p className="text-panna-4 mt-[10px]">
                Taproom &amp; birreria inglese
                <br />
                Catania · dal 1993
              </p>
            </div>

            <div className="text-panna-3 flex flex-col gap-[6px]">
              <p className="font-titoli text-ambra-ink mb-[6px] text-[0.76rem] font-medium tracking-[0.16em] uppercase">
                Dove &amp; quando
              </p>
              {impostazioni.indirizzo && <p>{impostazioni.indirizzo}</p>}
              {impostazioni.orari.map((fascia, i) => (
                <p key={i}>
                  {fascia.giorni}
                  {fascia.giorni && fascia.orario ? ': ' : ''}
                  {fascia.orario}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-[6px]">
              <p className="font-titoli text-ambra-ink mb-[6px] text-[0.76rem] font-medium tracking-[0.16em] uppercase">
                Contatti
              </p>
              {impostazioni.telefono && (
                <a
                  className="text-panna-3 hover:text-ambra inline-block py-1 transition-colors"
                  href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                >
                  {impostazioni.telefono}
                </a>
              )}
              {impostazioni.instagram && (
                <a
                  className="text-panna-3 hover:text-ambra inline-block py-1 transition-colors"
                  href={impostazioni.instagram}
                >
                  Instagram
                </a>
              )}
              {impostazioni.facebook && (
                <a
                  className="text-panna-3 hover:text-ambra inline-block py-1 transition-colors"
                  href={impostazioni.facebook}
                >
                  Facebook
                </a>
              )}
              {impostazioni.email && (
                <a
                  className="text-panna-3 hover:text-ambra inline-block py-1 transition-colors"
                  href={`mailto:${impostazioni.email}`}
                >
                  {impostazioni.email}
                </a>
              )}
            </div>
          </div>

          <p className="border-ambra/20 text-panna-4 mt-[46px] border-t pt-[22px] text-center text-[0.82rem] tracking-[0.04em]">
            © {nome} · Catania · MCMXCIII
          </p>
        </div>
      </footer>

      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} />}
    </div>
  )
}
