// Sezione "Come arrivare": indica il locale e porta alle indicazioni di Google
// Maps. Niente mappa incorporata: l'embed di Google richiede una chiave API
// (l'iframe senza chiave viene bloccato), mentre i link a Maps funzionano sempre
// e risolvono il locale per NOME (più l'indirizzo se presente), quindi sono
// precisi anche senza coordinate. Per una mappa interattiva dentro la pagina
// servirebbe una chiave Google Maps Embed API.
export function ComeArrivare({ nomePub, indirizzo }: { nomePub: string; indirizzo: string }) {
  const luogo = [nomePub, indirizzo].filter(Boolean).join(', ')
  const q = encodeURIComponent(luogo)
  const indicazioni = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const sullaMappa = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <section id="dove" className="isola-notte border-ambra/20 scroll-mt-24 border-t">
      <div className="mx-auto grid max-w-[1200px] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)] md:grid-cols-2">
        <div>
          <h2 className="font-insegna text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] font-bold">
            Come arrivare
          </h2>
          <p className="text-panna-3 mt-[20px] max-w-[420px] text-[1.12rem] leading-[1.7] text-pretty">
            {indirizzo
              ? `Ci trovi a ${indirizzo}. Apri le indicazioni e Google Maps ti porta al pub dal punto in cui ti trovi.`
              : 'Apri le indicazioni e Google Maps ti porta dritto al pub dal punto in cui ti trovi.'}
          </p>
          <div className="mt-[30px]">
            <a
              href={indicazioni}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-insegna btn-insegna-primario"
            >
              Indicazioni con Google Maps
            </a>
          </div>
        </div>

        {/* Scheda luogo: tutta cliccabile, apre la posizione su Google Maps. */}
        <a
          href={sullaMappa}
          target="_blank"
          rel="noopener noreferrer"
          className="border-ambra/30 hover:border-ambra/60 group block rounded-[4px] border bg-[rgb(226_162_58/0.05)] p-[clamp(28px,4vw,44px)] transition-colors"
        >
          <p className="font-insegna text-ambra-ink text-[0.76rem] font-semibold tracking-[0.16em] uppercase">
            Dove siamo
          </p>
          <p className="font-insegna text-panna mt-[14px] text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.05] font-bold">
            {nomePub}
          </p>
          {indirizzo && (
            <p className="text-panna-2 mt-[10px] text-[1.1rem] leading-snug">{indirizzo}</p>
          )}
          <p className="font-insegna text-ambra-ink group-hover:text-ambra-hover mt-[22px] text-[0.95rem] font-semibold transition-colors">
            Vedi sulla mappa →
          </p>
        </a>
      </div>
    </section>
  )
}
