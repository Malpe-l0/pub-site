import { richiediAdmin } from '@/lib/auth'
import { FormEvento } from '@/components/admin/FormEvento'
import { creaEvento } from '../azioni'

export default async function PaginaNuovoEvento() {
  await richiediAdmin()
  return (
    <>
      <h1>Nuovo evento</h1>
      <FormEvento evento={null} azione={creaEvento} />
    </>
  )
}
