import Link from 'next/link'
import { richiediAdmin } from '@/lib/auth'
import { getPopup, getMenuCompleto, getEventiFuturi, getGalleria } from '@/lib/dati'

export default async function PaginaPannello() {
  await richiediAdmin()

  const popup = getPopup()
  const voci = getMenuCompleto().reduce((totale, c) => totale + c.voci.length, 0)
  const eventi = getEventiFuturi().length
  const foto = getGalleria().length

  return (
    <>
      <h1>Benvenuto nel pannello</h1>
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
