import { getImpostazioni, getPopup } from '@/lib/dati'
import { popupDaMostrare } from '@/lib/popup'
import { dizionario, percorso, type Lang } from '@/lib/dizionario'
import { NavTaproom } from '@/components/sito/NavTaproom'
import { AnteprimaPalette } from '@/components/sito/AnteprimaPalette'
import { Popup } from '@/components/Popup'

export const dynamic = 'force-dynamic'

function Colonna({
  titolo,
  children,
}: {
  titolo: string
  children: React.ReactNode
}) {
  return (
    <div className="border-[rgb(244_238_221/0.14)] first:border-t-0 first:pt-0 first:sm:border-l-0 first:sm:pl-0 border-t pt-[clamp(24px,3vw,32px)] sm:border-t-0 sm:border-l sm:pt-0 sm:pl-[clamp(28px,4vw,44px)]">
      <p className="text-ambra-ink mb-4 text-[0.72rem] tracking-[0.28em] uppercase">{titolo}</p>
      {children}
    </div>
  )
}

export default async function LayoutSito({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Il layout radice [lang] ha già validato la lingua (404 altrimenti).
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const impostazioni = getImpostazioni()
  const avviso = popupDaMostrare(getPopup())
  const nome = impostazioni.nomePub || 'Il nostro pub'
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    [nome, impostazioni.indirizzo].filter(Boolean).join(' ')
  )}`
  const haOrari = impostazioni.orari.length > 0
  const haContatti = Boolean(
    impostazioni.indirizzo ||
      impostazioni.telefono ||
      impostazioni.instagram ||
      impostazioni.facebook ||
      impostazioni.email
  )

  return (
    <div className="sito-taproom relative flex min-h-screen flex-col overflow-x-hidden">
      <NavTaproom nomePub={nome} lang={lang} t={t.nav} />
      <main className="flex-1">{children}</main>

      <footer id="dove" className="bg-espresso-3 border-ambra/25 text-[#d8cfbe] scroll-mt-24 border-t">
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] pt-[clamp(60px,7vw,92px)] pb-10">
          <div className="mb-[clamp(40px,5vw,60px)] flex flex-col items-center text-center">
            <p className="font-titoli text-ambra-ink text-[clamp(1.9rem,4vw,2.7rem)] font-semibold tracking-[0.01em]">
              {nome}
            </p>
            <div className="mt-[18px] flex items-center gap-[clamp(14px,3vw,26px)]">
              <span className="bg-ambra/40 h-px w-[clamp(28px,6vw,64px)]" />
              <p className="font-titoli text-panna text-[clamp(1.3rem,2.8vw,1.9rem)] text-balance">
                {t.footer.slogan}
              </p>
              <span className="bg-ambra/40 h-px w-[clamp(28px,6vw,64px)]" />
            </div>
            {impostazioni.descrizione && (
              <p className="text-panna-3 mx-auto mt-5 max-w-[46ch] text-[0.95rem] leading-[1.75] text-pretty">
                {impostazioni.descrizione}
              </p>
            )}
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-[clamp(28px,4vw,48px)] gap-y-[clamp(28px,4vw,36px)] border-t border-[rgb(244_238_221/0.16)] pt-[clamp(40px,5vw,56px)]">
            {haOrari && (
              <Colonna titolo={t.footer.orari}>
                <ul className="space-y-3 text-[0.92rem] leading-[1.55] text-[#e8e0d0]">
                  {impostazioni.orari.map((fascia, i) => (
                    <li key={i}>
                      <span className="text-panna block font-medium">{fascia.giorni}</span>
                      <span className="text-ambra-ink">{fascia.orario}</span>
                    </li>
                  ))}
                </ul>
              </Colonna>
            )}

            {haContatti && (
              <Colonna titolo={t.footer.contatti}>
                <ul className="flex flex-col gap-3 text-[0.92rem]">
                  {impostazioni.indirizzo && (
                    <li className="text-[#e8e0d0] leading-[1.65]">{impostazioni.indirizzo}</li>
                  )}
                  {impostazioni.telefono && (
                    <li>
                      <a
                        className="text-[#e8e0d0] hover:text-panna transition-colors"
                        href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                      >
                        {impostazioni.telefono}
                      </a>
                    </li>
                  )}
                  {impostazioni.email && (
                    <li>
                      <a
                        className="text-[#e8e0d0] hover:text-panna transition-colors"
                        href={`mailto:${impostazioni.email}`}
                      >
                        {impostazioni.email}
                      </a>
                    </li>
                  )}
                  {impostazioni.instagram && (
                    <li>
                      <a
                        className="text-[#e8e0d0] hover:text-panna transition-colors"
                        href={impostazioni.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </li>
                  )}
                  {impostazioni.facebook && (
                    <li>
                      <a
                        className="text-[#e8e0d0] hover:text-panna transition-colors"
                        href={impostazioni.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </li>
                  )}
                </ul>
                {impostazioni.indirizzo && (
                  <a
                    href={maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-targhetta btn-targhetta-primario mt-5 w-full !px-4 text-center sm:w-auto"
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
                      className="mr-[9px] inline-block align-[-2px]"
                    >
                      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {t.footer.indicazioniMaps}
                  </a>
                )}
              </Colonna>
            )}

            <Colonna titolo={t.footer.esplora}>
              <ul className="flex flex-col gap-3 text-[0.92rem]">
                <li>
                  <a className="text-[#e8e0d0] hover:text-panna transition-colors" href={percorso(lang, '/menu')}>
                    {t.nav.menu}
                  </a>
                </li>
                <li>
                  <a className="text-[#e8e0d0] hover:text-panna transition-colors" href={percorso(lang, '/#birre')}>
                    {t.nav.birre}
                  </a>
                </li>
                <li>
                  <a className="text-[#e8e0d0] hover:text-panna transition-colors" href={percorso(lang, '/galleria')}>
                    {t.footer.galleria}
                  </a>
                </li>
              </ul>
            </Colonna>
          </div>

          <p className="text-panna-4 mt-[clamp(40px,5vw,60px)] text-center text-[0.78rem] tracking-[0.08em]">
            {t.footer.copyright(nome)}
          </p>
        </div>
      </footer>

      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} testoChiudi={t.popup.chiudi} />}
      {/* ponytail: switcher palette TEMPORANEO — rimuovere dopo la scelta. */}
      <AnteprimaPalette />
    </div>
  )
}
