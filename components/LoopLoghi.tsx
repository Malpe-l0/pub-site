export type LogoServizio = { id: string; nome: string; url: string | null }

/**
 * Scorrimento continuo dei loghi servizi (stile "logo loop"): traccia
 * duplicata per il giro senza stacchi, bordi sfumati e pausa al passaggio
 * del mouse. Tutto CSS (vedi .loop-loghi in globals.css): niente JavaScript
 * sul client.
 */
export function LoopLoghi({ loghi }: { loghi: LogoServizio[] }) {
  // Con pochi loghi la fascia sarebbe più corta dello schermo: si ripete la
  // lista finché la traccia è abbastanza lunga, poi la si raddoppia per il loop.
  const base: LogoServizio[] = []
  while (base.length < 12) base.push(...loghi)
  const traccia = [...base, ...base]

  return (
    <div className="loop-loghi">
      <div className="loop-loghi-traccia">
        {traccia.map((logo, indice) => {
          const copia = indice >= base.length
          return (
            <div key={`${logo.id}-${indice}`} aria-hidden={copia || undefined}>
              {logo.url ? (
                <img src={logo.url} alt={copia ? '' : logo.nome} className="h-12 w-auto" />
              ) : (
                <span className="font-titoli text-verde text-lg">{logo.nome}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
