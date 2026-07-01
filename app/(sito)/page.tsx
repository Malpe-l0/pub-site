import { getImpostazioni, getMenuPubblico, getGalleriaPubblica } from '@/lib/dati'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { CartaMenu } from '@/components/sito/CartaMenu'

// Sfondo "carta" delle sezioni chiare (birre, gallery): crema + texture grana.
const CARTA = {
  backgroundColor: '#f4eedd',
  backgroundImage: "url('/taproom/grain.png')",
  backgroundRepeat: 'repeat' as const,
}

// Galleria di riserva: foto del bundle, se il gestore non ne ha ancora caricate.
const FOTO_DEFAULT = ['/taproom/foto-bancone.jpg', '/taproom/foto-pinta.jpg', '/taproom/foto-sala.jpg']

export default async function Home() {
  const impostazioni = getImpostazioni()
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const vetrina = getGalleriaPubblica()

  const nome = impostazioni.nomePub || 'Il nostro pub'
  const fotoGalleria =
    vetrina.foto.length > 0 ? vetrina.foto.slice(0, 3).map((f) => f.src) : FOTO_DEFAULT
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
          <p className="text-ambra-ink mb-[14px] text-[0.74rem] tracking-[0.42em] uppercase">
            British Pub · dal 1993
          </p>
          <h1 className="font-titoli text-panna text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] font-semibold text-balance [text-shadow:0_2px_26px_rgba(0,0,0,0.5)]">
            {nome}
          </h1>
          {heroServizio && (
            <p className="text-panna-2 mx-auto mt-6 max-w-[34ch] text-[0.86rem] leading-[1.6] tracking-[0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              {heroServizio}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-[14px]">
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
        <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(40px,6vw,80px)] px-[clamp(24px,5vw,52px)] pt-[clamp(40px,6vw,64px)] pb-[clamp(64px,9vw,108px)] md:grid-cols-2">
          <div>
            <h2 className="font-titoli text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1.02] font-semibold">
              Un angolo
              <br />
              d’Inghilterra
              <br />a Imola
            </h2>
            <p className="text-panna-3 mt-[26px] max-w-[430px] text-[0.98rem] leading-[1.85] text-pretty">
              {racconto}
            </p>
            <div className="mt-[34px] flex flex-wrap gap-[14px]">
              <a href="#menu" className="btn-targhetta btn-targhetta-ghost">
                Scopri la carta
              </a>
              <a href="#dove" className="btn-targhetta btn-targhetta-primario">
                Dove siamo
              </a>
            </div>
          </div>
          <img
            src="/taproom/foto-pinta.jpg"
            alt="Pinte al bancone"
            className="h-[clamp(320px,42vw,480px)] w-full object-cover"
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
            {fotoGalleria.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Foto di ${nome}`}
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
