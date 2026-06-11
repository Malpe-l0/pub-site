/** Titolo di sezione del sito pubblico: serif verde con filetto doppio in ottone. */
export function TitoloSezione({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-titoli text-verde border-ottone mb-6 border-b-[3px] border-double pb-2 text-3xl"
    >
      {children}
    </h2>
  )
}
