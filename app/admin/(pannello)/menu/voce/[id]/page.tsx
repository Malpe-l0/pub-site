import { notFound } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { getCategorie, getVoceMenu } from '@/lib/dati'
import { FormVoce } from '@/components/admin/FormVoce'
import { aggiornaVoce } from '../../azioni'

export default async function PaginaModificaVoce({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await richiediAdmin()
  const { id } = await params
  const voce = getVoceMenu(Number(id))
  if (!voce) notFound()

  return (
    <>
      <h1>Modifica “{voce.nome}”</h1>
      <FormVoce voce={voce} categorie={getCategorie()} azione={aggiornaVoce} />
    </>
  )
}
