import type { FotoGalleria } from '@/lib/tipi'

export function GalleriaFoto({ foto }: { foto: FotoGalleria[] }) {
  if (foto.length === 0) {
    return <p>Le foto arrivano presto.</p>
  }

  return (
    <ul>
      {foto.map((f) => (
        <li key={f.id}>
          <figure>
            <img src={`/uploads/${f.file}`} alt={f.didascalia || 'Foto del locale'} loading="lazy" />
            {f.didascalia && <figcaption>{f.didascalia}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  )
}
