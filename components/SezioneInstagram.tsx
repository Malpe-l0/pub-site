import type { InstagramPost } from '@/lib/tipi'
import { TitoloSezione } from './TitoloSezione'

// Bacheca degli ultimi post di Instagram. Le miniature linkano al post; per i
// video si usa la thumbnail (media_url sarebbe il file video).
export function SezioneInstagram({
  post,
  username,
  profilo,
}: {
  post: InstagramPost[]
  username: string
  profilo: string
}) {
  if (post.length === 0) return null

  const linkProfilo = profilo || (username ? `https://www.instagram.com/${username}` : '')

  return (
    <section id="instagram" aria-labelledby="titolo-instagram" className="mt-12">
      <TitoloSezione id="titolo-instagram">Su Instagram</TitoloSezione>
      {linkProfilo && username && (
        <p className="mb-4 text-center">
          <a
            className="text-verde hover:text-oro underline"
            href={linkProfilo}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{username}
          </a>
        </p>
      )}
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {post.map((p) => {
          const immagine = p.thumbnailUrl || p.mediaUrl
          const testo = p.caption ? p.caption.slice(0, 120) : 'Post su Instagram'
          return (
            <li key={p.id}>
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block aspect-square overflow-hidden rounded"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={immagine}
                  alt={testo}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
