'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { avviaOAuth, salvaConfigInstagram, scollegaInstagram, verificaInstagram, sincronizzaInstagram, ErroreInstagram } from '@/lib/instagram'
import { testo } from '@/lib/form'
export async function collegaInstagram() {
  const user=await richiediAdmin('owner')
  let auth: ReturnType<typeof avviaOAuth>
  try { auth=avviaOAuth(user.id) }
  catch { redirect('/admin/instagram?errore=configurazione') }
  ;(await cookies()).set('instagram-oauth',auth.state,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/admin/instagram/callback',maxAge:600})
  registraAudit('instagram.collegamento_avviato',user.id)
  redirect(auth.url)
}
export async function scollega() {
  const user=await richiediAdmin('owner')
  scollegaInstagram()
  registraAudit('instagram.scollegato',user.id)
  redirect('/admin/instagram?esito=scollegato')
}
export async function verifica() {
  const user=await richiediAdmin('owner')
  const result=await verificaInstagram()
  registraAudit('instagram.verifica',user.id)
  redirect(`/admin/instagram?esito=${result.ok?'verificato':'errore'}`)
}
export async function sincronizza() {
  const user=await richiediAdmin()
  const result=await sincronizzaInstagram()
  registraAudit('instagram.sincronizzazione',user.id)
  redirect(`/admin/instagram?esito=${result.ok?'sincronizzato':'errore'}`)
}
export async function collegaManuale(form:FormData) {
  const user=await richiediAdmin('owner')
  try { await salvaConfigInstagram(testo(form,'userId'),testo(form,'accessToken')) }
  catch(e) { redirect(`/admin/instagram?errore=${e instanceof ErroreInstagram?encodeURIComponent(e.codice):'rete'}`) }
  registraAudit('instagram.collegato_manualmente',user.id)
  redirect('/admin/instagram?esito=collegato')
}
