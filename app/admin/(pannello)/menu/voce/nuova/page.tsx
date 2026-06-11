import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { getCategorie } from '@/lib/dati'
import { FormVoce } from '@/components/admin/FormVoce'
import { creaVoce } from '../../azioni'

export default async function PaginaNuovaVoce({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  await richiediAdmin()
  const categorie = getCategorie()
  if (categorie.length === 0) redirect('/admin/menu')
  const { categoria } = await searchParams

  return (
    <>
      <h1>Nuova voce del menu</h1>
      <FormVoce
        voce={null}
        categorie={categorie}
        categoriaPreselezionata={categoria ? Number(categoria) : undefined}
        azione={creaVoce}
      />
    </>
  )
}
