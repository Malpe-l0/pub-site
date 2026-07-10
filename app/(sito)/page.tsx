import { getImpostazioni, getMenuPubblico, getGalleriaPubblica } from '@/lib/dati'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { CartaMenu } from '@/components/sito/CartaMenu'

// Sfondo "carta" delle sezioni chiare (birre, gallery): crema + texture grana.
const CARTA = {
  backgroundColor: '#f4eedd',
  backgroundImage: "url('/taproom/grain.png')",
  backgroundRepeat: 'repeat' as const,
}

// Galleria di riserva: foto del bundle, per rabboccare quando il gestore ne ha
// caricate meno di tre — la griglia non deve mai restare mezza vuota.
const FOTO_DEFAULT = [
  { src: '/taproom/foto-bancone.jpg', alt: 'Il bancone in legno scuro, bicchieri appesi' },
  { src: '/taproom/foto-pinta.jpg', alt: 'Una pinta appena spillata al bancone' },
  { src: '/taproom/foto-sala.jpg', alt: 'La sala del pub, luci calde e boiserie' },
]

export default async function Home() {
  const impostazioni = getImpostazioni()
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const vetrina = getGalleriaPubblica()

  const nome = impostazioni.nomePub || 'Il nostro pub'
  const fotoGalleria = [
    ...vetrina.foto.slice(0, 3).map((f) => ({
      src: f.src,
      alt: f.didascalia || `Foto di ${nome}`,
    })),
    ...FOTO_DEFAULT,
  ].slice(0, 3)
  const racconto =
    impostazioni.descrizione ||
    'Bancone in legno scuro, bicchieri appesi e l’atmosfera dei pub d’oltremanica. Buona compagnia, cucina semplice e una selezione di birre, cocktail e amari — dal 1993.'
  const contattoVivo = impostazioni.telefono
    ? { href: `tel:${impostazioni.telefono.replace(/\s/g, '')}`, testo: 'Chiama per la carta di stasera' }
    : impostazioni.instagram
      ? { href: impostazioni.instagram, testo: 'Chiedi su Instagram' }
      : null
  const haFotoGestore = vetrina.foto.length > 0

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        id="top"
        className="relative flex h-[clamp(520px,78vh,800px)] items-center justify-center bg-cover bg-center text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,16,12,0.32), rgba(18,16,12,0.55)), url('/taproom/foto-sala.jpg')",
        }}
      >
        <div className="px-6">
          <p className="text-ambra-ink entrata-hero mb-[14px] text-[0.74rem] tracking-[0.42em] uppercase">
            British Pub · dal 1993
          </p>
          <h1 className="font-titoli text-panna entrata-hero text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] font-semibold text-balance [text-shadow:0_2px_26px_rgba(0,0,0,0.5)]">
            {nome}
          </h1>
          <div className="entrata-hero entrata-hero-2 mt-8">
            <a href="#menu" className="btn-targhetta btn-targhetta-primario">
              Vedi il menu
            </a>
          </div>
        </div>
      </section>

      {/* ===== STATEMENT BAND ===== */}
      <section className="text-panna bg-espresso">
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] pt-[clamp(34px,4.5vw,52px)]">
          <div className="flex items-center gap-[clamp(16px,3vw,30px)]">
            <span className="bg-ambra/40 h-px flex-1" />
            <span className="flex flex-col items-center text-center">
              <span className="font-titoli text-panna text-[clamp(1.35rem,4.5vw,2.3rem)] leading-none text-balance">
                30+ anni a Imola
              </span>
            </span>
            <span className="bg-ambra/40 h-px flex-1" />
          </div>
        </div>
        <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,6vw,72px)] px-[clamp(24px,5vw,52px)] pt-[clamp(40px,6vw,64px)] pb-[clamp(64px,9vw,108px)] md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="font-titoli text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.04] font-semibold text-balance">
              Un angolo d’Inghilterra a Imola
            </h2>
            <p className="text-panna-3 mt-[26px] max-w-[46ch] text-[1rem] leading-[1.85] text-pretty">
              {racconto}
            </p>
          </div>
          <img
            src="/taproom/foto-pinta.jpg"
            alt="Pinte appena spillate al bancone del Chelsea House"
            className="h-[clamp(340px,46vw,520px)] w-full border border-[rgb(234_179_37/0.28)] object-cover"
          />
        </div>
      </section>

      {/* ===== BIRRE ===== */}
      <section id="birre" className="scroll-mt-24 text-[#243a2d]" style={CARTA}>
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] py-[clamp(64px,9vw,120px)]">
          <div className="mx-auto mb-[clamp(44px,6vw,64px)] max-w-[680px] text-center">
            <p className="text-ambra-scura mb-4 text-[0.74rem] tracking-[0.4em] uppercase">
              La selezione
            </p>
            <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-semibold text-[#1e6240]">
              Le nostre birre
            </h2>
            <p className="mt-[22px] text-[0.98rem] leading-[1.85] text-[#56544a] text-pretty">
              Sei spine al bancone, dalla Guinness alla lager continentale. Chiedi al banco cosa
              c’è in spillatura stasera.
            </p>
          </div>
          <MuroBirre />
        </div>
      </section>

      {/* ===== MENU (carta a schede, dal pannello) ===== */}
      <section id="menu" className="text-panna bg-espresso-2 scroll-mt-24">
        <div className="mx-auto max-w-[1040px] px-[clamp(24px,5vw,52px)] py-[clamp(64px,9vw,120px)]">
          <div className="mx-auto mb-[clamp(36px,5vw,52px)] max-w-[700px] text-center">
            <p className="text-ambra-ink mb-4 text-[0.74rem] tracking-[0.4em] uppercase">La carta</p>
            <h2 className="font-titoli text-[clamp(2.4rem,5.4vw,4rem)] leading-[1.04] font-semibold">
              Il menu
            </h2>
            <p className="text-panna-3 mt-[22px] text-[0.98rem] leading-[1.85] text-pretty">
              Birre alla spina e in bottiglia, cocktail, bibite, amari e cucina da pub. Con un
              occhio di riguardo per le birre.
            </p>
          </div>
          {categorie.length > 0 ? (
            <CartaMenu categorie={categorie} />
          ) : (
            <div className="text-center">
              <p className="text-panna-3">Il menu è in aggiornamento.</p>
              {contattoVivo && (
                <a
                  href={contattoVivo.href}
                  className="btn-targhetta btn-targhetta-primario mt-6 inline-block"
                >
                  {contattoVivo.testo}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section style={CARTA}>
        <div className="mx-auto max-w-[1320px] px-[clamp(24px,5vw,40px)] py-[clamp(56px,8vw,96px)]">
          <div className="mb-[clamp(28px,4vw,40px)] flex items-end justify-between gap-4">
            <h2 className="font-titoli text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.05] font-semibold text-[#1e6240]">
              La sala
            </h2>
            {haFotoGestore && (
              <a
                href="/galleria"
                className="text-ambra-scura shrink-0 text-[0.82rem] tracking-[0.12em] uppercase underline-offset-4 hover:underline"
              >
                Tutta la galleria
              </a>
            )}
          </div>
          <div className="grid grid-cols-1 gap-[14px] sm:h-[clamp(260px,34vw,400px)] sm:grid-cols-3">
            {fotoGalleria.map((foto) => (
              <img
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover sm:aspect-auto sm:h-full"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
