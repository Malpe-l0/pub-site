// Selezione birre: loghi statici (ruotano nel codice/asset, non dal DB).
// Loghi in public/taproom/ — versioni PNG pulite del bundle Black Friar.
const BIRRE = [
  { nome: 'Guinness', stile: 'Irish Stout', logo: '/taproom/logo-guinness.png' },
  { nome: 'Kilkenny', stile: 'Irish Red Ale', logo: '/taproom/logo-kilkenny.png' },
  { nome: 'Bass', stile: 'English Pale Ale', logo: '/taproom/logo-bass.png' },
  { nome: 'Hobgoblin', stile: 'Ruby Ale', logo: '/taproom/logo-hobgoblin.png' },
  { nome: 'Arcobräu', stile: 'German Lager', logo: '/taproom/logo-arcobrau.png' },
  { nome: 'San Miguel', stile: 'Premium Lager', logo: '/taproom/logo-sanmiguel.png' },
]

/** Tre colonne di marchi su carta: logo, nome in Cinzel, stile in oro. */
export function MuroBirre() {
  return (
    <div className="grid grid-cols-2 gap-[clamp(28px,4vw,52px)] sm:grid-cols-3">
      {BIRRE.map((b) => (
        <div
          key={b.nome}
          className="flex min-h-[236px] flex-col items-center justify-center gap-[22px] px-3 py-[18px] text-center"
        >
          <div className="flex h-[100px] w-full items-center justify-center">
            <img
              src={b.logo}
              alt={`${b.nome} — ${b.stile}`}
              loading="lazy"
              className="max-h-[100px] w-auto max-w-[160px] object-contain"
            />
          </div>
          <div>
            <p className="font-titoli text-[1.3rem] text-[#243a2d]">{b.nome}</p>
            <p className="text-ambra-scura mt-[7px] text-[0.72rem] tracking-[0.22em] uppercase">
              {b.stile}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
