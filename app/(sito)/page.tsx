import {
  getImpostazioni,
  getEventiFuturi,
  getServiziAttivi,
  getMenuPubblico,
  getGalleriaPubblica,
} from '@/lib/dati'
import { giornoMese, formattaDataOra } from '@/lib/dataora'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { ComeArrivare } from '@/components/sito/ComeArrivare'

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
  const sottotitolo =
    impostazioni.descrizione ||
    "Sei spine sempre aperte, tutte le partite sui maxischermi e l'atmosfera di un pub inglese vero."

  // Striscia essenziale: informazioni di servizio, non decorazione.
  const essenziali = [
    impostazioni.indirizzo ? { etichetta: 'Dove', valore: impostazioni.indirizzo } : null,
    impostazioni.telefono
      ? {
          etichetta: 'Chiama',
          valore: impostazioni.telefono,
          href: `tel:${impostazioni.telefono.replace(/\s/g, '')}`,
        }
      : null,
    { etichetta: 'Alla spina', valore: 'Sei birre sempre aperte' },
    { etichetta: 'Sui maxischermi', valore: 'Tutte le partite' },
  ].filter((v): v is { etichetta: string; valore: string; href?: string } => v !== null)

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="isola-notte relative flex min-h-[100dvh] items-end bg-cover bg-[center_28%]"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(13,11,8,0.97) 3%, rgba(13,11,8,0.30) 50%, rgba(13,11,8,0.72)), url('/taproom/foto-pinta.jpg')",
        }}
      >
        <div className="mx-auto w-full max-w-[1180px] px-[clamp(24px,5vw,56px)] pb-[clamp(56px,9vw,104px)]">
          <p className="font-insegna text-ambra-ink mb-[18px] text-[0.84rem] font-semibold tracking-[0.18em] uppercase">
            British pub a Imola
          </p>
          <h1 className="font-insegna text-[clamp(3rem,9.5vw,7.4rem)] leading-[0.95] font-bold tracking-[-0.01em] text-balance">
            {impostazioni.nomePub || 'Il nostro pub'}
          </h1>
          <p className="text-panna-2 mt-[22px] max-w-[520px] text-[1.16rem] leading-[1.65] text-pretty">
            {sottotitolo}
          </p>
          <div className="mt-[34px] flex flex-wrap items-center gap-[14px]">
            <a href="#menu" className="btn-insegna btn-insegna-primario">
              Vedi il menu
            </a>
            <a href="#birre" className="btn-insegna btn-insegna-ghost">
              Le birre alla spina
            </a>
          </div>
        </div>
      </section>

      {/* ===== STRISCIA ESSENZIALE (servizio, non decorazione) ===== */}
      <div className="isola-notte bg-espresso-3 border-ambra/30 border-y">
        <ul className="mx-auto flex max-w-[1180px] flex-col divide-y divide-[rgb(226_162_58/0.16)] px-[clamp(24px,5vw,56px)] py-[10px] sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-[clamp(20px,4vw,52px)] sm:divide-y-0 sm:py-[18px]">
          {essenziali.map((e) => {
            const corpo = (
              <>
                <span className="font-insegna text-ambra-ink text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
                  {e.etichetta}
                </span>
                <span className="font-insegna text-panna text-[1.02rem] font-medium">
                  {e.valore}
                </span>
              </>
            )
            return (
              <li
                key={e.etichetta}
                className="flex items-baseline gap-[10px] py-[11px] sm:py-0"
              >
                {e.href ? (
                  <a href={e.href} className="hover:text-ambra flex items-baseline gap-[10px] transition-colors">
                    {corpo}
                  </a>
                ) : (
                  corpo
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* ===== BIRRE ===== */}
      <section
        id="birre"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)]"
      >
        <div>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="font-insegna text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] font-bold text-balance">
              Sei spine,
              <br />
              sempre aperte
            </h2>
            <p className="text-panna-3 max-w-[400px] text-[1.05rem] leading-[1.6] text-pretty">
              Stout irlandesi, ale inglesi e lager continentali. Le insegne che trovi spillate al
              bancone, sera dopo sera.
            </p>
          </div>
          <MuroBirre />
          <p className="text-panna-4 mt-[22px] text-[0.95rem] italic">
            La selezione ruota nel tempo. Chiedi al bancone le spine del giorno.
          </p>
        </div>
      </section>

      {/* ===== MENU (split testo / foto) ===== */}
      <section id="menu" className="bg-espresso-2 border-ambra/15 scroll-mt-24 border-y">
        <div className="mx-auto grid max-w-[1200px] items-center gap-[clamp(32px,6vw,84px)] px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)] md:grid-cols-2">
          <div>
            <h2 className="font-insegna text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] font-bold">
              In cucina
            </h2>
            <p className="text-panna-3 mt-[20px] max-w-[440px] text-[1.12rem] leading-[1.7] text-pretty">
              Cucina da pub: roba semplice fatta bene, da accompagnare alla tua pinta.
            </p>
            {categorie.length > 0 && (
              <div className="mt-[26px] flex flex-wrap gap-[10px]">
                {categorie.map((c) => (
                  <span
                    key={c}
                    className="font-insegna text-panna border-ambra/30 border px-[14px] py-[7px] text-[0.92rem] font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-[32px]">
              <a href="/menu" className="btn-insegna btn-insegna-primario">
                Sfoglia il menu completo
              </a>
            </div>
          </div>
          <div
            className="border-ambra/20 min-h-[300px] rounded-[4px] border bg-cover bg-center md:min-h-[420px]"
            style={{ backgroundImage: "url('/taproom/foto-bancone.jpg')" }}
            role="img"
            aria-label="Il bancone del Chelsea House"
          />
        </div>
      </section>

      {/* ===== SPORT (foto a tutta pagina + tessere servizi) ===== */}
      <section
        id="sport"
        className="isola-notte relative scroll-mt-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13,11,8,0.88), rgba(13,11,8,0.93)), url('/taproom/foto-sala.jpg')",
        }}
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-[clamp(40px,6vw,80px)] px-[clamp(24px,5vw,40px)] py-[clamp(64px,9vw,118px)] md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-insegna text-ambra-ink mb-[16px] text-[0.84rem] font-semibold tracking-[0.18em] uppercase">
              Sui maxischermi
            </p>
            <h2 className="font-insegna text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] font-bold text-balance">
              Tutte le partite, ogni sera
            </h2>
            <p className="text-panna-3 mt-[20px] mb-[28px] max-w-[460px] text-[1.12rem] leading-[1.7] text-pretty">
              Più maxischermi accesi e l&apos;audio sulla partita che conta. Dal big match di Premier
              al posticipo di Serie A.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {COMPETIZIONI.map((c) => (
                <span
                  key={c}
                  className="font-insegna text-panna border-panna/20 bg-panna/[0.06] border px-[14px] py-[8px] text-[0.92rem] font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {servizi.length > 0 && (
            <div className="border-ambra/30 bg-espresso border p-[clamp(24px,4vw,36px)]">
              <p className="font-insegna text-ambra-ink mb-[20px] text-center text-[0.76rem] font-semibold tracking-[0.16em] uppercase">
                Trasmettiamo con
              </p>
              <div className="grid grid-cols-2 gap-[12px]">
                {servizi.map((s) => (
                  <div
                    key={s.id}
                    className="bg-panna flex h-[92px] items-center justify-center rounded-[4px] p-[20px]"
                  >
                    {s.logo ? (
                      <img
                        src={`/uploads/${s.logo}`}
                        alt={s.nome}
                        loading="lazy"
                        className="max-h-[52px] w-auto max-w-[130px] object-contain"
                      />
                    ) : (
                      <span className="font-insegna text-espresso text-xl font-bold">{s.nome}</span>
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
          <div>
            <h2 className="font-insegna mb-[40px] text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] font-bold">
              Le serate
            </h2>
            <div className="grid gap-[16px] md:grid-cols-2">
              {eventi.slice(0, 6).map((e) => {
                const { giorno, mese } = giornoMese(e.dataOra)
                return (
                  <article
                    key={e.id}
                    className="border-ambra/20 hover:border-ambra/50 bg-espresso-2 flex items-start gap-[20px] border px-[26px] py-[24px] transition-colors"
                  >
                    <span className="text-nerocaldo bg-ambra flex shrink-0 flex-col items-center rounded-[4px] px-[14px] py-[10px] leading-none">
                      <span className="font-insegna text-[1.5rem] font-bold">{giorno}</span>
                      <span className="font-insegna mt-[3px] text-[0.7rem] font-semibold tracking-[0.1em] uppercase">
                        {mese}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-insegna text-[1.4rem] leading-tight font-semibold">
                        {e.titolo}
                      </h3>
                      <p className="text-panna-3 mt-[6px] text-[1rem] leading-[1.55] text-pretty">
                        {e.descrizione || formattaDataOra(e.dataOra)}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== GALLERIA ===== */}
      <section className="mx-auto max-w-[1320px] px-[clamp(24px,5vw,40px)] pb-[clamp(64px,9vw,110px)]">
        <div>
          <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-insegna text-[clamp(1.9rem,4vw,2.8rem)] leading-tight font-bold">
              Il locale
            </h2>
            <a
              href="/galleria"
              className="font-insegna text-ambra-ink hover:text-ambra-hover text-[1rem] font-semibold transition-colors"
            >
              Tutte le foto
            </a>
          </div>
          <div className="grid grid-cols-2 gap-[12px] sm:h-[clamp(360px,42vw,460px)] sm:grid-cols-3 sm:grid-rows-2 sm:[&>*:first-child]:col-span-2 sm:[&>*:first-child]:row-span-2">
            {fotoGalleria.slice(0, 3).map((src, i) => (
              <div
                key={i}
                className={`rounded-[4px] bg-cover bg-center ${
                  i === 0 ? 'col-span-2 aspect-[16/10] sm:aspect-auto' : 'aspect-square sm:aspect-auto'
                }`}
                style={{ backgroundImage: `url('${src}')` }}
                role="img"
                aria-label="Foto del Chelsea House"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== COME ARRIVARE ===== */}
      <ComeArrivare
        nomePub={impostazioni.nomePub || 'Il nostro pub'}
        indirizzo={impostazioni.indirizzo}
      />
    </>
  )
}
