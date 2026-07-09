// Sezione "Come arrivare": indica il locale e porta alle indicazioni di Google
// Maps. Niente mappa incorporata: l'embed di Google richiede una chiave API
// (l'iframe senza chiave viene bloccato), mentre i link a Maps funzionano sempre
// e risolvono il locale per NOME (più l'indirizzo se presente), quindi sono
// precisi anche senza coordinate.
export function ComeArrivare({
  nomePub,
  indirizzo,
  orari = '',
}: {
  nomePub: string
  indirizzo: string
  orari?: string
}) {
  const luogo = [nomePub, indirizzo].filter(Boolean).join(', ')
  const q = encodeURIComponent(luogo)
  const indicazioni = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const sullaMappa = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <section
      id="dove"
      className="bg-espresso text-panna scroll-mt-24 border-t border-[rgb(234_179_37/0.16)]"
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(24px,5vw,52px)] py-[clamp(64px,9vw,118px)] md:grid-cols-2">
        <div>
          <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-semibold">
            Come arrivare
          </h2>
          <p className="text-panna-3 mt-5 max-w-[420px] text-[1.05rem] leading-[1.7] text-pretty">
            {indirizzo
              ? `Ci trovi a ${indirizzo}. Apri le indicazioni e Google Maps ti porta al pub dal punto in cui ti trovi.`
              : 'Apri le indicazioni e Google Maps ti porta dritto al pub dal punto in cui ti trovi.'}
          </p>
          {orari && (
            <p className="text-panna mt-4 max-w-[420px] text-[1rem] leading-[1.6]">{orari}</p>
          )}
          <div className="mt-8">
            <a
              href={indicazioni}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-targhetta btn-targhetta-primario w-full sm:w-auto"
            >
              Indicazioni su Maps
            </a>
          </div>
        </div>

        {/* Scheda luogo: tutta cliccabile, apre la posizione su Google Maps. */}
        <a
          href={sullaMappa}
          target="_blank"
          rel="noopener noreferrer"
          className="group block border border-[rgb(234_179_37/0.3)] bg-[rgb(234_179_37/0.05)] p-[clamp(28px,4vw,44px)] transition-colors hover:border-[rgb(234_179_37/0.6)]"
        >
          <p className="text-ambra-ink text-[0.74rem] tracking-[0.2em] uppercase">Dove siamo</p>
          <p className="font-titoli mt-[14px] text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.05] font-semibold">
            {nomePub}
          </p>
          {indirizzo && (
            <p className="text-panna-2 mt-[10px] text-[1.05rem] leading-snug">{indirizzo}</p>
          )}
          <p className="text-ambra-ink group-hover:text-ambra-hover mt-[22px] text-[0.9rem] font-medium transition-colors">
            Vedi sulla mappa →
          </p>
        </a>
      </div>
    </section>
  )
}
