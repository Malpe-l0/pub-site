// Muro dei marchi: selezione statica (i loghi ruotano nel codice/asset, non dal DB).
// Loghi in public/taproom/. NB: logo-guinness.jpg ha sfondo a scacchi nel bundle
// originale — sostituire con un PNG trasparente pulito quando disponibile.
const BIRRE = [
  { nome: 'Guinness', stile: 'Irish Stout', logo: '/taproom/logo-guinness.jpg' },
  { nome: 'Kilkenny', stile: 'Irish Red Ale', logo: '/taproom/logo-kilkenny.png' },
  { nome: 'Bass', stile: 'English Pale Ale', logo: '/taproom/logo-bass.png' },
  { nome: 'Hobgoblin', stile: 'Ruby Ale', logo: '/taproom/logo-hobgoblin.png' },
  { nome: 'Arcobräu', stile: 'German Lager', logo: '/taproom/logo-arcobrau.png' },
  { nome: 'San Miguel', stile: 'Premium Lager', logo: '/taproom/logo-sanmiguel.png' },
]

/** Pannello crema uniforme con i marchi divisi da linee sottili: l'effetto "muro". */
export function MuroBirre() {
  return (
    <div className="bg-panna-muro border-ambra/25 grid grid-cols-2 border shadow-[0_24px_60px_rgb(0_0_0/0.4)] min-[860px]:grid-cols-3">
      {BIRRE.map((b) => (
        <div
          key={b.nome}
          className="border-lineamuro hover:bg-panna-muro-hover flex min-h-[230px] flex-col items-center justify-center gap-5 border-r border-b px-7 pt-[38px] pb-[30px] text-center transition-colors"
        >
          <div className="flex h-[90px] w-full items-center justify-center">
            <img
              src={b.logo}
              alt={`${b.nome} — ${b.stile}`}
              loading="lazy"
              className="max-h-[90px] w-auto max-w-[160px] object-contain"
            />
          </div>
          <div>
            <p className="font-titoli text-[1.18rem] font-semibold tracking-[0.03em] text-[#1f1b15] uppercase">
              {b.nome}
            </p>
            <p className="text-ambra-scura mt-[5px] text-[0.74rem] font-bold tracking-[0.16em] uppercase">
              {b.stile}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
