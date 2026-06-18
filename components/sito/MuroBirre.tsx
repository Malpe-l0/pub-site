// Banco delle birre: selezione statica (i loghi ruotano nel codice/asset, non dal DB).
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

/**
 * Griglia editoriale: ogni birra è una placca crema con il logo, e sotto il
 * nome (insegna) e lo stile (ambra). La placca usa panna-muro, che resta crema
 * in entrambi i temi, così i loghi (spesso su fondo chiaro) restano leggibili.
 */
export function MuroBirre() {
  return (
    <div className="grid grid-cols-2 gap-[clamp(12px,2vw,20px)] min-[860px]:grid-cols-3">
      {BIRRE.map((b) => (
        <div key={b.nome} className="flex flex-col gap-[14px]">
          <div className="bg-panna-muro border-lineamuro flex h-[clamp(110px,16vw,140px)] items-center justify-center rounded-[4px] border px-6">
            <img
              src={b.logo}
              alt={`${b.nome} — ${b.stile}`}
              loading="lazy"
              className="max-h-[78px] w-auto max-w-[150px] object-contain"
            />
          </div>
          <div>
            <p className="font-insegna text-panna text-[1.2rem] leading-tight font-semibold">
              {b.nome}
            </p>
            <p className="text-ambra-ink mt-[2px] text-[0.82rem] font-semibold tracking-[0.06em] uppercase">
              {b.stile}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
