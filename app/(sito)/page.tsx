import {
  getImpostazioni,
  getEventiFuturi,
  getServiziAttivi,
  getMenuPubblico,
  getGalleriaPubblica,
} from '@/lib/dati'
import { giornoMese, formattaDataOra } from '@/lib/dataora'
import { MuroBirre } from '@/components/sito/MuroBirre'

// Liste statiche del look Taproom (non hanno una tabella nel DB).
const TICKER = [
  '6 birre alla spina',
  'Sky',
  'DAZN',
  'Live music',
  'Quiz night',
  'Cucina da pub',
  'Dal 1993',
]
const COMPETIZIONI = [
  'Premier League',
  'Serie A',
  'Champions League',
  'Europa League',
  'Coppe nazionali',
  'Grandi eventi',
]
// Galleria di riserva: foto del bundle, se il gestore non ne ha ancora caricate.
const FOTO_DEFAULT = ['/taproom/foto-bancone.jpg', '/taproom/foto-sala.jpg', '/taproom/foto-pinta.jpg']

export default async function Home() {
  const impostazioni = getImpostazioni()
  const eventi = getEventiFuturi()
  const servizi = getServiziAttivi()
  const menu = getMenuPubblico()
  const vetrina = getGalleriaPubblica()

  const categorie = menu.filter((c) => c.voci.length > 0).map((c) => c.nome)
  const fotoGalleria =
    vetrina.foto.length > 0 ? vetrina.foto.slice(0, 3).map((f) => f.src) : FOTO_DEFAULT
  const colsGalleria =
    fotoGalleria.length === 1
      ? 'sm:grid-cols-1'
      : fotoGalleria.length === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-3'
  const sottotitolo =
    impostazioni.descrizione ||
    'Il taproom inglese di Catania. Sei spine sempre aperte e tutte le partite sui maxischermi. Legno scuro, bicchieri appesi, atmosfera da pub vero.'

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="isola-notte relative flex min-h-screen items-end bg-cover bg-[center_28%]"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(21,18,14,0.98) 4%, rgba(21,18,14,0.35) 52%, rgba(21,18,14,0.78)), url('/taproom/foto-pinta.jpg')",
        }}
      >
        <div className="mx-auto w-full max-w-[1180px] px-[clamp(24px,5vw,56px)] pb-[clamp(54px,8vw,92px)]">
          <div className="mb-[26px] flex items-center gap-[15px]">
            <span className="bg-ambra/65 h-px w-9" />
            <span aria-hidden className="text-ambra-ink text-[0.6rem] leading-none">◆</span>
            <span className="font-titoli text-ambra-ink text-[0.78rem] font-medium tracking-[0.3em] uppercase">
              Birreria inglese · Catania · est. 1993
            </span>
            <span aria-hidden className="text-ambra-ink text-[0.6rem] leading-none">◆</span>
            <span className="bg-ambra/65 h-px w-9" />
          </div>
          <h1 className="font-titoli text-[clamp(3.6rem,11.5vw,9.5rem)] leading-[0.9] font-bold tracking-[-0.015em] text-balance uppercase">
            {impostazioni.nomePub || 'Il nostro pub'}
          </h1>
          <p className="text-panna-2 mt-[22px] max-w-[540px] text-[1.14rem] leading-[1.7] text-pretty">
            {sottotitolo}
          </p>
          <div className="mt-[34px] flex flex-wrap items-center gap-4">
            <a href="#menu" className="btn-targhetta btn-targhetta-primario">
              Vedi il menu
            </a>
            <a href="#birre" className="btn-targhetta btn-targhetta-ghost">
              Le birre alla spina
            </a>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="isola-notte bg-ambra text-espresso border-espresso overflow-hidden border-y-[3px]">
        <div className="marquee-traccia flex w-max py-[13px]">
          {[0, 1].map((copia) => (
            <div
              key={copia}
              aria-hidden={copia === 1}
              className="font-titoli flex items-center gap-[30px] pr-[30px] text-[0.92rem] font-semibold tracking-[0.16em] uppercase"
            >
              {TICKER.flatMap((t, i) => [
                <span key={`t${i}`}>{t}</span>,
                <span key={`d${i}`} aria-hidden className="text-[0.7rem] opacity-70">
                  ◆
                </span>,
              ])}
            </div>
          ))}
        </div>
      </div>

      {/* ===== BIRRE ===== */}
      <section
        id="birre"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)]"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-titoli text-ambra-ink mb-3 text-[0.8rem] font-medium tracking-[0.32em] uppercase">
              Sei spine sempre aperte
            </p>
            <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold tracking-[0.01em] uppercase">
              Le nostre birre
            </h2>
          </div>
          <p className="text-panna-3 max-w-[380px] text-[1.02rem] leading-[1.65] text-pretty">
            Stout irlandesi, ale inglesi e lager continentali. Le insegne che trovi spillate al
            bancone.
          </p>
        </div>
        <MuroBirre />
        <p className="text-panna-4 mt-[18px] text-[0.9rem] italic">
          La selezione ruota nel tempo. Chiedi al bancone le spine del giorno.
        </p>
      </section>

      {/* ===== MENU ===== */}
      <section id="menu" className="bg-espresso-2 border-ambra/15 scroll-mt-24 border-y">
        <div className="mx-auto grid max-w-[1200px] items-center gap-[clamp(40px,6vw,84px)] px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)] md:grid-cols-2">
          <div>
            <p className="font-titoli text-ambra-ink mb-[14px] text-[0.8rem] font-medium tracking-[0.32em] uppercase">
              In cucina
            </p>
            <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold uppercase">
              Il menu
            </h2>
            <p className="text-panna-3 mt-[22px] max-w-[440px] text-[1.1rem] leading-[1.7] text-pretty">
              Cucina da pub: roba semplice fatta bene, da accompagnare alla tua pinta.
            </p>
            {categorie.length > 0 && (
              <div className="mt-[26px] flex flex-wrap gap-[10px]">
                {categorie.map((c) => (
                  <span
                    key={c}
                    className="font-titoli text-ambra-ink border-ambra/40 border px-4 py-2 text-[0.8rem] font-medium tracking-[0.1em] uppercase"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-[34px]">
              <a href="/menu" className="btn-targhetta btn-targhetta-primario">
                Sfoglia il menu completo
              </a>
            </div>
          </div>
          <div
            className="border-ambra/20 min-h-[340px] border bg-cover bg-center"
            style={{ backgroundImage: "url('/taproom/foto-bancone.jpg')" }}
            role="img"
            aria-label="Il bancone del Chelsea House"
          />
        </div>
      </section>

      {/* ===== SPORT ===== */}
      <section
        id="sport"
        className="isola-notte relative scroll-mt-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13,11,8,0.9), rgba(13,11,8,0.94)), url('/taproom/foto-sala.jpg')",
        }}
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-[clamp(40px,6vw,80px)] px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)] md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-[18px] flex items-center gap-[14px]">
              <span className="bg-ambra/65 h-px w-8" />
              <span className="font-titoli text-ambra-ink text-[0.78rem] font-medium tracking-[0.3em] uppercase">
                Sui maxischermi
              </span>
            </div>
            <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold uppercase">
              Tutte le partite,
              <br />
              ogni sera
            </h2>
            <p className="text-panna-3 mt-[22px] mb-[28px] max-w-[460px] text-[1.1rem] leading-[1.7] text-pretty">
              Più maxischermi accesi e l&apos;audio sulla partita che conta. Dal big match di Premier
              al posticipo di Serie A.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {COMPETIZIONI.map((c) => (
                <span
                  key={c}
                  className="font-titoli text-panna border-panna/20 bg-panna/[0.07] border px-4 py-[9px] text-[0.82rem] font-medium tracking-[0.1em] uppercase"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {servizi.length > 0 && (
            <div className="border-ambra/30 bg-espresso border p-[clamp(28px,4vw,40px)]">
              <p className="font-titoli text-ambra-ink mb-[22px] text-center text-[0.76rem] font-medium tracking-[0.22em] uppercase">
                Trasmettiamo con
              </p>
              <div className="flex flex-col gap-[14px]">
                {servizi.map((s) => (
                  <div
                    key={s.id}
                    className="bg-panna flex h-[110px] items-center justify-center rounded-[4px] p-[26px]"
                  >
                    {s.logo ? (
                      <img
                        src={`/uploads/${s.logo}`}
                        alt={s.nome}
                        loading="lazy"
                        className="max-h-[62px] w-auto max-w-[150px] object-contain"
                      />
                    ) : (
                      <span className="font-titoli text-espresso text-2xl font-bold uppercase">
                        {s.nome}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== SERATE (eventi dal pannello) ===== */}
      {eventi.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)]">
          <div className="mb-[42px]">
            <p className="font-titoli text-ambra-ink mb-3 text-[0.8rem] font-medium tracking-[0.32em] uppercase">
              Cosa succede al pub
            </p>
            <h2 className="font-titoli text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold uppercase">
              Le serate
            </h2>
          </div>
          <div className="grid gap-[14px] md:grid-cols-2">
            {eventi.slice(0, 6).map((e) => {
              const { giorno, mese } = giornoMese(e.dataOra)
              return (
                <article
                  key={e.id}
                  className="border-ambra/20 hover:border-ambra/50 bg-espresso-2 flex items-start gap-[22px] border px-[30px] py-[28px] transition-colors"
                >
                  <span className="font-titoli text-nerocaldo bg-ambra shrink-0 px-3 py-2 text-[0.78rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase">
                    {giorno} {mese}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-titoli text-[1.4rem] font-medium uppercase">{e.titolo}</h3>
                    <p className="text-panna-3 mt-[6px] text-[1rem] leading-[1.6] text-pretty">
                      {e.descrizione || formattaDataOra(e.dataOra)}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ===== GALLERY ===== */}
      <section className="mx-auto max-w-[1320px] px-[clamp(24px,5vw,40px)] pb-[clamp(64px,9vw,110px)]">
        <div className={`grid grid-cols-1 gap-[12px] sm:h-[clamp(280px,38vw,440px)] ${colsGalleria}`}>
          {fotoGalleria.map((src, i) => (
            <div
              key={i}
              className="aspect-[16/10] bg-cover bg-center sm:aspect-auto sm:h-full"
              style={{ backgroundImage: `url('${src}')` }}
              role="img"
              aria-label="Foto del Chelsea House"
            />
          ))}
        </div>
      </section>
    </>
  )
}
