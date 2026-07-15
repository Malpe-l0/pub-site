import type { Metadata } from 'next'
import { getImpostazioni } from '@/lib/dati'
import { dizionario, type Lang } from '@/lib/dizionario'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const lang = (await params).lang as Lang
  return {
    title: dizionario(lang).dove.titolo,
    alternates: { languages: { it: '/dove', en: '/en/dove' } },
  }
}

// ponytail: hero provvisorio. /taproom/facciata.jpg è per ora una foto interna
// (la sala) in attesa dello scatto vero della facciata: per sostituirla basta
// rimpiazzare quel file, nessuna modifica al codice.
const FACCIATA = '/taproom/facciata.jpg'

export default async function PaginaDove({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const imp = getImpostazioni()
  const nome = imp.nomePub || 'Il nostro pub'

  const luogo = [nome, imp.indirizzo].filter(Boolean).join(', ')
  const q = encodeURIComponent(luogo)
  const indicazioni = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const sullaMappa = `https://www.google.com/maps/search/?api=1&query=${q}`

  const telefonoPulito = imp.telefono ? imp.telefono.replace(/\s/g, '') : ''

  return (
    <>
      {/* ===== HERO facciata ===== */}
      <section
        className="relative flex h-[clamp(440px,62vh,640px)] items-center justify-center bg-cover bg-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(18,16,12,0.34), rgba(18,16,12,0.6)), url('${FACCIATA}')`,
        }}
      >
        <div className="px-6">
          <p className="text-ambra-ink entrata-hero mb-[14px] text-[0.74rem] tracking-[0.42em] uppercase">
            {nome} · Imola
          </p>
          <h1 className="font-titoli text-panna entrata-hero text-[clamp(2.4rem,6.5vw,5rem)] leading-[1.04] font-semibold text-balance [text-shadow:0_2px_26px_rgba(0,0,0,0.5)]">
            {t.dove.titolo}
          </h1>
          {imp.indirizzo && (
            <p className="text-panna-2 entrata-hero entrata-hero-2 mx-auto mt-6 max-w-[36ch] text-[0.95rem] leading-[1.6] tracking-[0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              {imp.indirizzo}
            </p>
          )}
        </div>
      </section>

      {/* ===== Come arrivare ===== */}
      <section className="text-panna bg-espresso">
        <div className="mx-auto grid max-w-[1180px] items-start gap-[clamp(36px,6vw,80px)] px-[clamp(24px,5vw,52px)] py-[clamp(64px,9vw,120px)] md:grid-cols-[1fr_0.85fr]">
          {/* Colonna sinistra: i fatti */}
          <div>
            <h2 className="font-titoli text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-semibold text-balance">
              {t.dove.comeArrivare}
            </h2>
            <p className="text-panna-3 mt-[24px] max-w-[52ch] text-[1rem] leading-[1.85] text-pretty">
              {imp.indirizzo
                ? t.dove.testoConIndirizzo(imp.indirizzo)
                : t.dove.testoSenzaIndirizzo}
            </p>

            <dl className="mt-[clamp(30px,4vw,44px)] flex flex-col gap-[22px]">
              {imp.indirizzo && (
                <div>
                  <dt className="text-ambra-ink text-[0.68rem] tracking-[0.22em] uppercase">
                    {t.dove.indirizzo}
                  </dt>
                  <dd className="mt-[6px] text-[1.02rem] leading-[1.5]">{imp.indirizzo}</dd>
                </div>
              )}
              {imp.orari.length > 0 && (
                <div>
                  <dt className="text-ambra-ink text-[0.68rem] tracking-[0.22em] uppercase">
                    {t.dove.orari}
                  </dt>
                  <dd className="mt-[6px] flex flex-col gap-[4px] text-[1.02rem] leading-[1.45]">
                    {imp.orari.map((fascia, i) => (
                      <span key={i}>
                        {fascia.giorni}
                        {fascia.giorni && fascia.orario ? ' · ' : ''}
                        <span className="text-ambra-ink">{fascia.orario}</span>
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {imp.telefono && (
                <div>
                  <dt className="text-ambra-ink text-[0.68rem] tracking-[0.22em] uppercase">
                    {t.dove.telefono}
                  </dt>
                  <dd className="mt-[6px] text-[1.02rem] leading-[1.5]">
                    <a href={`tel:${telefonoPulito}`} className="hover:text-ambra-ink transition-colors">
                      {imp.telefono}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-[clamp(30px,4vw,44px)]">
              <a
                href={indicazioni}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-targhetta btn-targhetta-primario"
              >
                {t.dove.indicazioniGoogle}
              </a>
            </div>
          </div>

          {/* Colonna destra: scheda luogo cliccabile → apre la posizione su Maps */}
          <a
            href={sullaMappa}
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:border-ambra/60 block border border-[rgb(234_179_37/0.3)] bg-[rgb(234_179_37/0.05)] p-[clamp(28px,4vw,44px)] transition-colors"
          >
            <p className="text-ambra-ink text-[0.74rem] tracking-[0.2em] uppercase">{t.dove.sullaMappa}</p>
            <p className="font-titoli mt-[14px] text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.05] font-semibold">
              {nome}
            </p>
            {imp.indirizzo && (
              <p className="text-panna-2 mt-[10px] text-[1.02rem] leading-snug">{imp.indirizzo}</p>
            )}
            <p className="text-ambra-ink group-hover:text-ambra-hover mt-[22px] text-[0.9rem] font-medium transition-colors">
              {t.dove.vediSuMaps}
            </p>
          </a>
        </div>
      </section>
    </>
  )
}
