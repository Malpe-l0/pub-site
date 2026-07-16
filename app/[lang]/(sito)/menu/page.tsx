import type { Metadata } from 'next'
import { getImpostazioni, getMenuPubblico } from '@/lib/dati'
import { dizionario, type Lang } from '@/lib/dizionario'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const lang = (await params).lang as Lang
  return {
    title: dizionario(lang).nav.menu,
    alternates: { languages: { it: '/menu', en: '/en/menu' } },
  }
}

// Carta stampata: fondo texture, inchiostro scuro — non il verde sala.
const CARTA = {
  backgroundColor: '#f4eedd',
  backgroundImage: "url('/taproom/carta-bg.jpg')",
  backgroundSize: 'cover' as const,
  backgroundPosition: 'center' as const,
  backgroundRepeat: 'no-repeat' as const,
}

export default async function PaginaMenu({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang
  const t = dizionario(lang)
  const categorie = getMenuPubblico().filter((c) => c.voci.length > 0)
  const imp = getImpostazioni()
  const contatto = imp.telefono
    ? { href: `tel:${imp.telefono.replace(/\s/g, '')}`, testo: t.menu.chiama }
    : imp.instagram
      ? { href: imp.instagram, testo: t.menu.chiedi }
      : null
  const euro = new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'EUR' })

  return (
    <div className="min-h-screen text-[#243a2d]" style={CARTA}>
      <div className="mx-auto max-w-[900px] px-[clamp(24px,5vw,40px)] pt-[120px] pb-[clamp(64px,9vw,110px)]">
        <h1 className="font-titoli text-[clamp(2.8rem,7vw,4.6rem)] leading-[1] font-bold text-[#1e6240] text-balance">
          {t.menu.titolo}
        </h1>
        <div className="su-carta filetto-epoca mt-6 mb-12" aria-hidden>
          <span className="text-[0.8rem] leading-none">◆</span>
        </div>

        {categorie.length === 0 ? (
          <div>
            <p className="text-[#56544a]">{t.menu.inAggiornamento}</p>
            {contatto && (
              <a href={contatto.href} className="btn-targhetta btn-targhetta-primario mt-6 inline-block">
                {contatto.testo}
              </a>
            )}
          </div>
        ) : (
          categorie.map((cat) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="mb-12">
              <h2
                id={`cat-${cat.id}`}
                className="font-titoli mb-6 border-b border-[#7e5b1f]/40 pb-[10px] text-[1.7rem] font-bold text-[#7e5b1f]"
              >
                {cat.nome}
              </h2>
              <ul className="space-y-6">
                {cat.voci.map((v) => (
                  <li key={v.id} className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-titoli text-[1.2rem] font-semibold text-[#243a2d]">
                          {v.nome}
                        </h3>
                        <span
                          aria-hidden
                          className="mx-1 flex-1 border-b border-dotted border-[#243a2d]/25"
                        />
                        <p className="font-targa text-[1.02rem] font-bold whitespace-nowrap text-[#7e5b1f]">
                          {euro.format(v.prezzoCentesimi / 100)}
                        </p>
                      </div>
                      {v.descrizione && (
                        <p className="mt-1 text-[0.97rem] leading-[1.6] text-[#56544a]">
                          {v.descrizione}
                        </p>
                      )}
                    </div>
                    {v.foto && (
                      <img
                        src={`/uploads/${v.foto}`}
                        alt={v.nome}
                        loading="lazy"
                        className="h-20 w-20 shrink-0 object-cover"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
