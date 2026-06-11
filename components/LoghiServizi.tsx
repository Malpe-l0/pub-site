export type LogoServizio = { id: string; nome: string; url: string | null }

/**
 * Loghi dei servizi (Sky, Serie A, ...) come targhette statiche in pergamena
 * con bordo ottone: l'equivalente delle placchette dietro al bancone.
 * Niente animazioni: è un pub di trent'anni, non una landing page.
 */
export function LoghiServizi({ loghi }: { loghi: LogoServizio[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-5">
      {loghi.map((logo) => (
        <li
          key={logo.id}
          className="bg-pergamena border-ottone/50 flex h-24 w-44 items-center justify-center rounded border-2 px-5"
        >
          {logo.url ? (
            <img src={logo.url} alt={logo.nome} className="max-h-14 w-auto max-w-full" />
          ) : (
            <span className="font-titoli text-verde text-xl">{logo.nome}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
