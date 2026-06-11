import { getImpostazioni, getEventiFuturi, getServiziAttivi, getMenuPubblico, getGalleria } from '@/lib/dati'
import { SezioneEventi } from '@/components/SezioneEventi'
import { CaroselloLoghi } from '@/components/CaroselloLoghi'
import { ListaMenu } from '@/components/ListaMenu'
import { GalleriaFoto } from '@/components/GalleriaFoto'

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
      <section aria-labelledby="titolo-presentazione">
        <h1 id="titolo-presentazione">{impostazioni.nomePub || 'Il nostro pub'}</h1>
        {impostazioni.descrizione && <p>{impostazioni.descrizione}</p>}
      </section>

      <SezioneEventi eventi={eventi} />

      {paginaUnica && (
        <section id="menu" aria-labelledby="titolo-menu">
          <h2 id="titolo-menu">Menu</h2>
          <ListaMenu categorie={getMenuPubblico()} />
        </section>
      )}

      {paginaUnica && galleria.length > 0 && (
        <section id="galleria" aria-labelledby="titolo-galleria">
          <h2 id="titolo-galleria">Galleria</h2>
          <GalleriaFoto foto={galleria} />
        </section>
      )}

      {loghi.length > 0 && (
        <section aria-labelledby="titolo-servizi">
          <h2 id="titolo-servizi">Da noi trovi</h2>
          <CaroselloLoghi loghi={loghi} />
        </section>
      )}
    </>
  )
}
