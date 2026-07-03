import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { getImpostazioni, getPopup, getMenuCompleto, getEventiFuturi, getGalleria } from '@/lib/dati'

export default async function PaginaPannello() {
  await richiediAdmin()

  const popup = getPopup()
  const voci = getMenuCompleto().reduce((totale, c) => totale + c.voci.length, 0)
  const eventi = getEventiFuturi().length
  const foto = getGalleria().length

  // Il sito pubblico omette con garbo orari e contatti mancanti: il gestore
  // però deve saperlo, altrimenti non se ne accorge mai.
  const impostazioni = getImpostazioni()
  const haContatti = Boolean(
    impostazioni.telefono || impostazioni.instagram || impostazioni.facebook || impostazioni.email
  )
  const mancanti = [
    impostazioni.orari.length === 0 && 'gli orari di apertura',
    !haContatti && 'i contatti (telefono, social o email)',
  ].filter(Boolean)

  return (
    <>
      <h1>Benvenuto nel pannello</h1>
      {mancanti.length > 0 && (
        <p style={{ color: '#8c2f1b' }}>
          <strong>Sul sito mancano {mancanti.join(' e ')}.</strong> I visitatori non li vedono
          finché non li inserisci nelle <Link href="/admin/impostazioni">Impostazioni</Link>.
        </p>
      )}
      <ul>
        <li>
          <Link href="/admin/popup">Pop-up avvisi</Link>: {popup.attivo ? 'ATTIVO' : 'spento'}
        </li>
        <li>
          <Link href="/admin/menu">Menu</Link>: {voci} voci
        </li>
        <li>
          <Link href="/admin/eventi">Eventi</Link>: {eventi} in programma
        </li>
        <li>
          <Link href="/admin/galleria">Galleria</Link>: {foto} foto
        </li>
      </ul>
    </>
  )
}
