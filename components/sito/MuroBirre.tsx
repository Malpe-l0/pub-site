// Selezione birre: loghi statici (ruotano nel codice/asset, non dal DB).
// Loghi in public/taproom/ — versioni PNG pulite del bundle Black Friar.
// "Muro di targhe": ogni birra è una targa smaltata con il suo fondo,
// come la parete di insegne di metallo del locale.
const BIRRE = [
  { nome: 'Guinness', stile: 'Irish Stout', logo: '/taproom/logo-guinness.png', smalto: 'targa-nero' },
  { nome: 'Kilkenny', stile: 'Irish Red Ale', logo: '/taproom/logo-kilkenny.png', smalto: 'targa-rosso' },
  { nome: 'Bass', stile: 'English Pale Ale', logo: '/taproom/logo-bass.png', smalto: 'targa-panna' },
  { nome: 'Hobgoblin', stile: 'Ruby Ale', logo: '/taproom/logo-hobgoblin.png', smalto: 'targa-verde' },
  { nome: 'Arcobräu', stile: 'German Lager', logo: '/taproom/logo-arcobrau.png', smalto: 'targa-panna' },
  { nome: 'San Miguel', stile: 'Premium Lager', logo: '/taproom/logo-sanmiguel.png', smalto: 'targa-nero' },
]

/** Parete di targhe smaltate: piastra con doppio filetto, logo, nome a Clarendon. */
export function MuroBirre() {
  return (
    <div className="grid grid-cols-2 gap-[clamp(14px,2.4vw,26px)] sm:grid-cols-3">
      {BIRRE.map((b, i) => (
        <div
          key={b.nome}
          className={`targa ${b.smalto} flex min-h-[236px] flex-col items-center justify-center gap-[18px] text-center ${
            i % 2 ? 'sm:translate-y-[14px]' : ''
          }`}
        >
          <div className="flex h-[96px] w-full items-center justify-center">
            <img
              src={b.logo}
              alt={`${b.nome} — ${b.stile}`}
              loading="lazy"
              className="max-h-[96px] w-auto max-w-[150px] object-contain"
            />
          </div>
          <div>
            <p className="font-targa text-[1.22rem] font-bold tracking-[0.02em] uppercase">
              {b.nome}
            </p>
            <p className="mt-[7px] text-[0.68rem] tracking-[0.24em] uppercase opacity-80">
              {b.stile}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
