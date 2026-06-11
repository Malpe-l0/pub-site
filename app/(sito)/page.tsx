import {
  getImpostazioni,
  getEventiFuturi,
  getServiziAttivi,
  getMenuPubblico,
  getGalleria,
} from '@/lib/dati'
import { stemmaDisponibile } from '@/lib/stemma'
import { SezioneEventi } from '@/components/SezioneEventi'
import { LoghiServizi } from '@/components/LoghiServizi'
import { ListaMenu } from '@/components/ListaMenu'
import { GalleriaFoto } from '@/components/GalleriaFoto'
import { TitoloSezione } from '@/components/TitoloSezione'

export default async function Home() {
  const impostazioni = getImpostazioni()
  const eventi = getEventiFuturi()
  const servizi = getServiziAttivi()
  const paginaUnica = impostazioni.stileSito === 'onepage'

  const loghi = servizi.map((servizio) => ({
    id: String(servizio.id),
    nome: servizio.nome,
    url: servizio.logo ? `/uploads/${servizio.logo}` : null,
  }))

  // In modalità "pagina unica" menu e galleria diventano sezioni della home,
  // raggiunte dalle ancore della barra di navigazione. Il footer (contatti e
  // orari) sta nel layout e fa da sezione #contatti.
  const galleria = paginaUnica ? getGalleria() : []

  return (
    <>
      <section aria-labelledby="titolo-presentazione" className="py-10 text-center">
        {stemmaDisponibile() && (
          <img src="/stemma.png" alt="" className="mx-auto mb-6 h-44 w-auto" />
        )}
        <h1 id="titolo-presentazione" className="font-titoli text-verde text-5xl">
          {impostazioni.nomePub || 'Il nostro pub'}
        </h1>
        {/* Tagline fissa: il sito è del Chelsea House. Se servirà renderla
            modificabile diventerà un campo delle impostazioni. */}
        <p className="font-titoli text-ottone mt-3 text-sm tracking-[0.3em] uppercase">
          — Birreria dal 1993 —
        </p>
        {impostazioni.descrizione && (
          <p className="mx-auto mt-6 max-w-xl text-lg">{impostazioni.descrizione}</p>
        )}
      </section>

      {loghi.length > 0 && (
        <section aria-labelledby="titolo-servizi">
          <TitoloSezione id="titolo-servizi">Da noi trovi</TitoloSezione>
          <LoghiServizi loghi={loghi} />
        </section>
      )}

      <SezioneEventi eventi={eventi} />

      {paginaUnica && (
        <section id="menu" aria-labelledby="titolo-menu" className="mt-12">
          <TitoloSezione id="titolo-menu">Menu</TitoloSezione>
          <ListaMenu categorie={getMenuPubblico()} />
        </section>
      )}

      {paginaUnica && galleria.length > 0 && (
        <section id="galleria" aria-labelledby="titolo-galleria" className="mt-12">
          <TitoloSezione id="titolo-galleria">Galleria</TitoloSezione>
          <GalleriaFoto foto={galleria} />
        </section>
      )}
    </>
  )
}
