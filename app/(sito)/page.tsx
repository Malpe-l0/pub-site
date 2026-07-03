import { getImpostazioni, getMenuPubblico, getGalleriaPubblica } from '@/lib/dati'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { CartaMenu } from '@/components/sito/CartaMenu'
import { ComeArrivare } from '@/components/sito/ComeArrivare'

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
  // Riga di servizio nell'hero: indirizzo + orari dal pannello, così "che orari fa?"
  // ha risposta già nella prima schermata (principio #4: prima gli orari e il menu).
  const orariSintesi = impostazioni.orari
    .map((f) => [f.giorni, f.orario].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(' · ')
  const heroServizio = [impostazioni.indirizzo, orariSintesi].filter(Boolean).join(' — ')
  // Orari non ancora inseriti dal pannello: la domanda "che orari fa?" merita
  // comunque una risposta — si rimanda a un canale vivo (telefono, poi Instagram).
  const fallbackOrari = !orariSintesi
    ? impostazioni.telefono
      ? { href: `tel:${impostazioni.telefono.replace(/\s/g, '')}`, testo: 'Chiama per gli orari' }
      : impostazioni.instagram
        ? { href: impostazioni.instagram, testo: 'Orari e aperture su Instagram' }
        : null
    : null

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        id="top"
        className="relative flex h-[clamp(560px,82vh,860px)] items-center justify-center bg-cover bg-center text-center"
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
          {heroServizio && (
            <p className="text-panna-2 entrata-hero entrata-hero-2 mx-auto mt-6 max-w-[34ch] text-[0.86rem] leading-[1.6] tracking-[0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              {heroServizio}
            </p>
          )}
          {fallbackOrari && (
            <p className="entrata-hero entrata-hero-2 mt-3 text-[0.86rem] tracking-[0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              <a
                href={fallbackOrari.href}
                className="text-panna-2 hover:text-panna inline-block py-2 underline underline-offset-4 transition-colors"
              >
                {fallbackOrari.testo}
              </a>
            </p>
          )}
          <div className="entrata-hero entrata-hero-3 mt-8 flex flex-wrap items-center justify-center gap-[14px]">
            <a href="#menu" className="btn-targhetta btn-targhetta-primario">
              Vedi il menu
            </a>
            <a href="#dove" className="btn-targhetta btn-targhetta-ghost">
              Dove siamo
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
              <span className="font-titoli text-panna text-[clamp(1.5rem,3.2vw,2.3rem)] leading-none whitespace-nowrap">
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
            <div className="mt-[34px]">
              <a href="#menu" className="btn-targhetta btn-targhetta-primario">
                Scopri la carta
              </a>
            </div>
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
              Sei insegne sempre spillate al bancone, dalla Guinness alla lager continentale. La
              rotazione cambia nel tempo: chiedi al banco le spine del giorno.
            </p>
          </div>
          <MuroBirre />
          <p className="mt-5 text-center text-[0.82rem] text-[#6b6450] italic">
            La selezione ruota nel tempo — sei spine, sempre fredde.
          </p>
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
            <p className="text-panna-3 text-center">
              Il menu è in aggiornamento, torna a trovarci presto.
            </p>
          )}
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section style={CARTA}>
        <div className="mx-auto max-w-[1320px] px-[clamp(24px,5vw,40px)] py-[clamp(56px,8vw,96px)]">
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

      <ComeArrivare nomePub={nome} indirizzo={impostazioni.indirizzo} />
    </>
  )
}
