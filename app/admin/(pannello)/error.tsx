'use client'
export default function ErrorePannello({ reset }: { reset: () => void }) {
  return <section role="alert"><h1>Operazione non completata</h1><p>Controlla i dati inseriti. Usa prezzi positivi, date valide e immagini statiche fino a 8 MB (massimo 5 per volta). Se il problema continua, contatta chi gestisce il sito.</p><button onClick={reset}>Torna al modulo</button></section>
}
