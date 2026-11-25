import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { completaOAuth, consumaOAuth, ErroreInstagram } from '@/lib/instagram'
export const runtime='nodejs'
export async function GET(req:NextRequest) {
  const user=await richiediAdmin('owner')
  const jar=await cookies()
  const cookie=jar.get('instagram-oauth')?.value || ''
  jar.set('instagram-oauth','',{path:'/admin/instagram/callback',maxAge:0,httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'})
  let query='esito=collegato'
  try {
    const revision=consumaOAuth(req.nextUrl.searchParams.get('state')||'',cookie,user.id)
    if (req.nextUrl.searchParams.has('error')) throw new ErroreInstagram('annullato','Collegamento annullato.')
    await completaOAuth(req.nextUrl.searchParams.get('code')||'',revision)
    registraAudit('instagram.collegato_oauth',user.id)
  } catch(e) {
    query=`errore=${e instanceof ErroreInstagram?encodeURIComponent(e.codice):'oauth'}`
    registraAudit('instagram.collegamento_fallito',user.id)
  }
  // Location relativo conserva l'host del browser anche dietro proxy o in sviluppo.
  const response=new Response(null,{status:303,headers:{Location:`/admin/instagram?${query}`}})
  response.headers.set('Cache-Control','no-store')
  response.headers.set('Referrer-Policy','no-referrer')
  return response
}
