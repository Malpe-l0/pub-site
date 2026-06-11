import { notFound } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { getEvento } from '@/lib/dati'
import { FormEvento } from '@/components/admin/FormEvento'
import { aggiornaEvento } from '../azioni'

export default async function PaginaModificaEvento({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await richiediAdmin()
  const { id } = await params
  const evento = getEvento(Number(id))
  if (!evento) notFound()

  return (
    <>
      <h1>Modifica “{evento.titolo}”</h1>
      <FormEvento evento={evento} azione={aggiornaEvento} />
    </>
  )
}
