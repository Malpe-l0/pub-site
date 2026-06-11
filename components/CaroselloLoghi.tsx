'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export type LogoCarosello = { id: string; nome: string; url: string | null }

export function CaroselloLoghi({ loghi }: { loghi: LogoCarosello[] }) {
  const [riferimento] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 2500, stopOnInteraction: false }),
  ])

  return (
    <div className="carosello bg-crema py-4" ref={riferimento}>
      <div className="carosello-contenitore">
        {loghi.map((logo) => (
          <div className="carosello-slide" key={logo.id}>
            {logo.url ? (
              <img src={logo.url} alt={logo.nome} className="h-14 w-auto" />
            ) : (
              <span className="font-titoli text-verde text-lg">{logo.nome}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
