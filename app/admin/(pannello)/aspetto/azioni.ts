'use server'
import { redirect } from 'next/navigation'
import { richiediAdmin, registraAudit } from '@/lib/auth'
import { getImpostazioni } from '@/lib/dati'
import { db } from '@/lib/db'
import { CAMPI_TESTO, assetValido } from '@/lib/branding'
import { testo } from '@/lib/form'
import { fileDaForm, eliminaFoto } from '@/lib/upload'
import { MAX_FILES } from '@/lib/media'

export async function salvaAspetto(form: FormData) {
  const user = await richiediAdmin('owner')
  const brand = getImpostazioni().branding
  const colore = testo(form, 'colore', 7)
  if (!/^#[a-fA-F0-9]{6}$/.test(colore)) throw new Error('Colore non valido')
  if ([...form.values()].filter(v => v instanceof File && v.size > 0).length > MAX_FILES) throw new Error('Carica al massimo 5 immagini per volta.')
  const relative = (name: string) => name.startsWith('/uploads/') ? name.slice(9) : null
  const asset = async (field: string, previous: string, width: number) => {
    const name = await fileDaForm(form, field, width, relative(previous))
    if (name) return `/uploads/${name}`
    return form.get(`rimuovi${field[0].toUpperCase()}${field.slice(1)}`) === 'on' ? '' : previous
  }
  const next = { ...brand, colore, font: form.get('font') === 'serif' ? 'serif' as const : 'sans' as const }
  next.logo = await asset('logo', brand.logo, 400)
  next.hero = await asset('hero', brand.hero, 1800)
  next.heroAlt = testo(form, 'heroAlt', 250)
  for (const key of Object.keys(next.sezioni) as (keyof typeof next.sezioni)[]) next.sezioni[key] = form.get(`sezione_${key}`) === 'on'
  for (const lang of ['it','en'] as const) for (const key of Object.keys(CAMPI_TESTO)) {
    const field = `${lang}_${key}`
    if (form.has(field)) {
      const value = testo(form, field, 5000)
      if (value) next.testi[lang][key] = value
      else delete next.testi[lang][key]
    }
  }
  const count = Math.min(24, brand.birre.length + 3)
  const beers = []
  for (let i = 0; i < count; i++) {
    const nome = testo(form, `birra_${i}_nome`, 100)
    if (!nome) { if (brand.birre[i]?.logo.startsWith('/uploads/')) await eliminaFoto(brand.birre[i].logo.slice(9)); continue }
    const logo = await asset(`birra_${i}`, brand.birre[i]?.logo || '', 400)
    if (!assetValido(logo)) throw new Error('Immagine non valida')
    beers.push({ nome, stile: testo(form, `birra_${i}_stile`, 100), logo })
  }
  next.birre = beers
  db.prepare('UPDATE impostazioni SET branding_json=? WHERE id=1').run(JSON.stringify(next))
  registraAudit('sito.aspetto_aggiornato', user.id)
  redirect('/admin/aspetto?salvato=1')
}
