import type { FotoGalleria } from '@/lib/tipi'

export function GalleriaFoto({ foto }: { foto: FotoGalleria[] }) {
  if (foto.length === 0) {
    return <p>Le foto arrivano presto.</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {foto.map((f) => (
        <li key={f.id}>
          <figure>
            <img
              src={`/uploads/${f.file}`}
              alt={f.didascalia || 'Foto del locale'}
              loading="lazy"
              className="aspect-[4/3] w-full rounded object-cover"
            />
            {f.didascalia && (
              <figcaption className="text-inchiostro/70 mt-1 text-sm italic">
                {f.didascalia}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  )
}
