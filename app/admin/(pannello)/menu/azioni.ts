'use server'

import { redirect } from 'next/navigation'
import { richiediAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { getVoceMenu } from '@/lib/dati'
import { eliminaFoto, fileDaForm } from '@/lib/upload'
import { testo, numero } from '@/lib/form'

// --- Categorie ---

export async function creaCategoria(formData: FormData) {
  await richiediAdmin()
  const nome = testo(formData, 'nome')
  if (nome) {
    db.prepare('INSERT INTO categorie (nome, ordine) VALUES (?, ?)').run(
      nome,
      numero(formData, 'ordine')
    )
  }
  redirect('/admin/menu')
}

export async function aggiornaCategoria(formData: FormData) {
  await richiediAdmin()
  const nome = testo(formData, 'nome')
  if (nome) {
    db.prepare('UPDATE categorie SET nome = ?, ordine = ? WHERE id = ?').run(
      nome,
      numero(formData, 'ordine'),
      numero(formData, 'id')
    )
  }
  redirect('/admin/menu')
}

export async function eliminaCategoria(formData: FormData) {
  await richiediAdmin()
  const id = numero(formData, 'id')
  // Elimina anche i file delle foto delle voci (la riga sparisce col CASCADE).
  const foto = db
    .prepare('SELECT foto FROM voci_menu WHERE categoria_id = ? AND foto IS NOT NULL')
    .all(id) as { foto: string }[]
  for (const f of foto) await eliminaFoto(f.foto)
  db.prepare('DELETE FROM categorie WHERE id = ?').run(id)
  redirect('/admin/menu')
}

// --- Voci ---

export async function creaVoce(formData: FormData) {
  await richiediAdmin()
  const nome = testo(formData, 'nome')
  if (!nome) redirect('/admin/menu')

  const prezzoCentesimi = Math.round(Number(formData.get('prezzo')) * 100)
  const foto = await fileDaForm(formData, 'foto', 800, null)

  db.prepare(
    `INSERT INTO voci_menu (nome, descrizione, prezzo_centesimi, categoria_id, disponibile, ordine, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    nome,
    testo(formData, 'descrizione'),
    Number.isFinite(prezzoCentesimi) ? prezzoCentesimi : 0,
    numero(formData, 'categoriaId'),
    formData.get('disponibile') === 'on' ? 1 : 0,
    numero(formData, 'ordine'),
    foto
  )
  redirect('/admin/menu')
}

export async function aggiornaVoce(formData: FormData) {
  await richiediAdmin()
  const id = numero(formData, 'id')
  const esistente = getVoceMenu(id)
  const nome = testo(formData, 'nome')
  if (!esistente || !nome) redirect('/admin/menu')

  const prezzoCentesimi = Math.round(Number(formData.get('prezzo')) * 100)
  const foto = await fileDaForm(formData, 'foto', 800, esistente.foto)

  db.prepare(
    `UPDATE voci_menu
     SET nome = ?, descrizione = ?, prezzo_centesimi = ?, categoria_id = ?,
         disponibile = ?, ordine = ?, foto = ?
     WHERE id = ?`
  ).run(
    nome,
    testo(formData, 'descrizione'),
    Number.isFinite(prezzoCentesimi) ? prezzoCentesimi : 0,
    numero(formData, 'categoriaId'),
    formData.get('disponibile') === 'on' ? 1 : 0,
    numero(formData, 'ordine'),
    foto,
    id
  )
  redirect('/admin/menu')
}

export async function impostaDisponibile(formData: FormData) {
  await richiediAdmin()
  db.prepare('UPDATE voci_menu SET disponibile = ? WHERE id = ?').run(
    formData.get('disponibile') === '1' ? 1 : 0,
    numero(formData, 'id')
  )
  redirect('/admin/menu')
}

export async function eliminaVoce(formData: FormData) {
  await richiediAdmin()
  const id = numero(formData, 'id')
  const voce = getVoceMenu(id)
  if (voce) {
    await eliminaFoto(voce.foto)
    db.prepare('DELETE FROM voci_menu WHERE id = ?').run(id)
  }
  redirect('/admin/menu')
}
