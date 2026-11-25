import type { Metadata } from 'next'
import { Clock, MapPin, Phone } from 'lucide-react'
import { getImpostazioni, getMenuPubblico, getGalleriaPubblica } from '@/lib/dati'
import { dizionario, percorso, type Lang } from '@/lib/dizionario'
import { MuroBirre } from '@/components/sito/MuroBirre'
import { CartaMenu } from '@/components/sito/CartaMenu'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// PAGINA DI PROVA TEMPORANEA — hero variante B (foto a tutta larghezza con testo
// sopra). Da cancellare dopo la scelta dell'hero definitivo.
export const metadata: Metadata = {
  title: 'Prova hero B',
  robots: { index: false },
}

export default async function ProvaHeroB({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const impostazioni = getImpostazioni()
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const vetrina = getGalleriaPubblica()

  const nome = impostazioni.nomePub || 'Il nostro pub'
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
  const racconto =
    (lang === 'it' && impostazioni.descrizione) || t.home.raccontoDefault
  const contattoVivo = impostazioni.telefono
    ? { href: `tel:${impostazioni.telefono.replace(/\s/g, '')}`, testo: t.menu.chiama }
    : impostazioni.instagram
      ? { href: impostazioni.instagram, testo: t.menu.chiedi }
      : null
  const haFotoGestore = vetrina.foto.length > 0

  const fatti = [
    impostazioni.orari.length > 0 && {
      icona: Clock,
      etichetta: t.footer.orari,
      righe: impostazioni.orari.map((f) =>
        [f.giorni, f.orario].filter(Boolean).join(' · ')
      ),
    },
    impostazioni.indirizzo && {
      icona: MapPin,
      etichetta: t.dove.indirizzo,
      righe: [impostazioni.indirizzo],
    },
    impostazioni.telefono && {
      icona: Phone,
      etichetta: t.dove.telefono,
      righe: [impostazioni.telefono],
      href: `tel:${impostazioni.telefono.replace(/\s/g, '')}`,
    },
  ].filter(Boolean) as { icona: typeof Clock; etichetta: string; righe: string[]; href?: string }[]

  return (
    <>
      {/* ===== HERO B: foto piena con testo sopra ===== */}
      <section
        className="relative flex min-h-[480px] items-end bg-cover bg-center sm:min-h-[560px]"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(9,9,11,0.78), rgba(9,9,11,0.25) 55%, rgba(9,9,11,0.15)), url('/taproom/foto-sala.jpg')",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pb-16">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <Badge
              variant="outline"
              className="border-[#d4b14a]/60 bg-black/20 px-3 py-1 text-xs text-[#e8cd7a]"
            >
              {t.home.kicker}
            </Badge>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl">
              {nome}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-pretty text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
              {racconto}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#menu" className={cn(buttonVariants({ size: 'lg' }))}>
                {t.home.vediMenu}
              </a>
              <a
                href={percorso(lang, '/dove')}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white'
                )}
              >
                {t.nav.dove}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {fatti.length > 0 && (
          <div className="grid gap-6 border-y py-8 sm:grid-cols-3 sm:gap-8 sm:divide-x">
            {fatti.map((fatto) => (
              <div key={fatto.etichetta} className="flex items-start gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <fatto.icona className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{fatto.etichetta}</p>
                  {fatto.righe.map((riga) =>
                    fatto.href ? (
                      <a
                        key={riga}
                        href={fatto.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {riga}
                      </a>
                    ) : (
                      <p key={riga} className="text-muted-foreground text-sm">
                        {riga}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== BIRRE ===== */}
      <section id="birre" className="bg-muted/40 scroll-mt-20 border-y">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 flex max-w-2xl flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t.home.nostreBirre}
            </h2>
            <p className="text-muted-foreground leading-7 text-pretty">{t.home.birreBlurb}</p>
          </div>
          <MuroBirre birre={[]} />
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section id="menu" className="scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 flex max-w-2xl flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t.home.ilMenu}
            </h2>
            <p className="text-muted-foreground leading-7 text-pretty">{t.home.menuBlurb}</p>
          </div>
          {categorie.length > 0 ? (
            <CartaMenu
              categorie={categorie}
              locale={t.locale}
              vediTutto={t.menu.vediTutto}
              hrefMenu={percorso(lang, '/menu')}
            />
          ) : (
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted-foreground">{t.menu.inAggiornamento}</p>
              {contattoVivo && (
                <a href={contattoVivo.href} className={cn(buttonVariants())}>
                  {contattoVivo.testo}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="bg-muted/40 border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t.home.laSala}
            </h2>
            {haFotoGestore && (
              <a
                href={percorso(lang, '/galleria')}
                className="text-muted-foreground hover:text-foreground shrink-0 text-sm font-medium underline-offset-4 transition-colors hover:underline"
              >
                {t.home.tuttaGalleria}
              </a>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {fotoGalleria.map((foto) => (
              <img
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
