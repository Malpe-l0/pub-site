import type { Metadata } from 'next'
import { getImpostazioni, getMenuPubblico, getGalleriaPubblica } from '@/lib/dati'
import { dizionario, percorso, type Lang } from '@/lib/dizionario'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { CartaMenu } from '@/components/sito/CartaMenu'

export const metadata: Metadata = {
  alternates: { languages: { it: '/', en: '/en' } },
}

// Sfondo "carta" delle sezioni chiare (birre, gallery): crema + texture grana.
const CARTA = {
  backgroundColor: '#f4eedd',
  backgroundImage: "url('/taproom/grain.png')",
  backgroundRepeat: 'repeat' as const,
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const impostazioni = getImpostazioni()
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const vetrina = getGalleriaPubblica()

  const nome = impostazioni.nomePub || 'Il nostro pub'
  // Galleria di riserva: foto del bundle, per rabboccare quando il gestore ne ha
  // caricate meno di tre — la griglia non deve mai restare mezza vuota.
  const fotoDefault = [
    { src: '/taproom/foto-bancone.jpg', alt: t.home.altBancone },
    { src: '/taproom/foto-pinta.jpg', alt: t.home.altPinta },
    { src: '/taproom/foto-sala.jpg', alt: t.home.altSala },
  ]
  const fotoGalleria = [
    ...vetrina.foto.slice(0, 3).map((f) => ({
      src: f.src,
      alt: f.didascalia || t.home.altFoto(nome),
    })),
    ...fotoDefault,
  ].slice(0, 3)
  // La descrizione dal pannello è in italiano: in inglese si usa il testo fisso.
  const racconto =
    (lang === 'it' && impostazioni.descrizione) || t.home.raccontoDefault
  const contattoVivo = impostazioni.telefono
    ? { href: `tel:${impostazioni.telefono.replace(/\s/g, '')}`, testo: t.menu.chiama }
    : impostazioni.instagram
      ? { href: impostazioni.instagram, testo: t.menu.chiedi }
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
          <p className="entrata-hero mb-[18px]">
            <span className="medaglione text-ambra-ink text-[0.62rem] tracking-[0.14em] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
              <span>{t.home.est[0]}</span>
              <span className="text-[1.05rem] font-bold">{t.home.est[1]}</span>
            </span>
          </p>
          <p className="text-ambra-ink entrata-hero mb-[14px] text-[0.74rem] tracking-[0.42em] uppercase">
            {t.home.kicker}
          </p>
          <h1 className="font-titoli text-panna entrata-hero text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] font-semibold text-balance [text-shadow:0_2px_26px_rgba(0,0,0,0.5)]">
            {nome}
          </h1>
          <p className="font-targa text-panna-2 entrata-hero entrata-hero-2 mx-auto mt-6 max-w-[44ch] text-[clamp(0.82rem,1.8vw,1rem)] font-medium tracking-[0.14em] uppercase [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
            {t.home.insegna}
          </p>
          <div className="entrata-hero entrata-hero-3 mt-8">
            <a href="#menu" className="btn-targhetta btn-targhetta-primario">
              {t.home.vediMenu}
            </a>
          </div>
        </div>
      </section>

      {/* ===== STATEMENT BAND ===== */}
      <section className="text-panna bg-espresso">
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] pt-[clamp(34px,4.5vw,52px)]">
          <div className="filetto-epoca">
            <span aria-hidden className="text-[0.8rem] leading-none">◆</span>
            <span className="font-titoli text-panna text-center text-[clamp(1.35rem,4.5vw,2.3rem)] leading-none text-balance">
              {t.home.band}
            </span>
            <span aria-hidden className="text-[0.8rem] leading-none">◆</span>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,6vw,72px)] px-[clamp(24px,5vw,52px)] pt-[clamp(40px,6vw,64px)] pb-[clamp(64px,9vw,108px)] md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="font-titoli text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.04] font-semibold text-balance">
              {t.home.titoloStoria}
            </h2>
            <p className="text-panna-3 mt-[26px] max-w-[46ch] text-[1rem] leading-[1.85] text-pretty">
              {racconto}
            </p>
          </div>
          <img
            src="/taproom/foto-pinta.jpg"
            alt={t.home.altPinte(nome)}
            className="h-[clamp(340px,46vw,520px)] w-full border border-[rgb(234_179_37/0.28)] object-cover"
          />
        </div>
      </section>

      {/* ===== BIRRE ===== */}
      <section id="birre" className="scroll-mt-24 text-[#243a2d]" style={CARTA}>
        <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,52px)] py-[clamp(64px,9vw,120px)]">
          <div className="mx-auto mb-[clamp(44px,6vw,64px)] max-w-[680px] text-center">
            <p className="text-ambra-scura mb-4 text-[0.74rem] tracking-[0.4em] uppercase">
              {t.home.laSelezione}
            </p>
            <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-semibold text-[#1e6240]">
              {t.home.nostreBirre}
            </h2>
            <p className="mt-[22px] text-[0.98rem] leading-[1.85] text-[#56544a] text-pretty">
              {t.home.birreBlurb}
            </p>
          </div>
          <MuroBirre />

          {/* La citazione appesa al muro: slogan come réclame smaltata d'epoca */}
          <div className="mx-auto mt-[clamp(44px,6vw,72px)] max-w-[640px]">
            <div className="targa targa-rosso text-center">
              <p className="font-targa text-[clamp(1.5rem,3.6vw,2.3rem)] leading-[1.25] font-bold italic text-balance">
                {t.footer.slogan}
              </p>
              <p className="mt-[16px] text-[0.68rem] tracking-[0.3em] uppercase opacity-85">
                {nome} · Imola
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MENU (carta a schede, dal pannello) ===== */}
      <section id="menu" className="text-panna bg-espresso-2 scroll-mt-24">
        <div className="mx-auto max-w-[1040px] px-[clamp(24px,5vw,52px)] py-[clamp(64px,9vw,120px)]">
          <div className="mx-auto mb-[clamp(36px,5vw,52px)] max-w-[700px] text-center">
            <p className="text-ambra-ink mb-4 text-[0.74rem] tracking-[0.4em] uppercase">
              {t.home.laCarta}
            </p>
            <h2 className="font-titoli text-[clamp(2.4rem,5.4vw,4rem)] leading-[1.04] font-semibold">
              {t.home.ilMenu}
            </h2>
            <p className="text-panna-3 mt-[22px] text-[0.98rem] leading-[1.85] text-pretty">
              {t.home.menuBlurb}
            </p>
          </div>
          {categorie.length > 0 ? (
            <CartaMenu
              categorie={categorie}
              locale={t.locale}
              vediTutto={t.menu.vediTutto}
              hrefMenu={percorso(lang, '/menu')}
            />
          ) : (
            <div className="text-center">
              <p className="text-panna-3">{t.menu.inAggiornamento}</p>
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
              {t.home.laSala}
            </h2>
            {haFotoGestore && (
              <a
                href={percorso(lang, '/galleria')}
                className="text-ambra-scura shrink-0 text-[0.82rem] tracking-[0.12em] uppercase underline-offset-4 hover:underline"
              >
                {t.home.tuttaGalleria}
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
