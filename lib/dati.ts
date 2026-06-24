import { db } from './db'
import { adessoInItalia } from './dataora'
import type {
  Impostazioni,
  Popup,
  Categoria,
  CategoriaConVoci,
  VoceMenu,
  Evento,
  Servizio,
  FotoGalleria,
  FotoVetrina,
  Punteggio,
} from './tipi'

// Letture dal database. Le pagine pubbliche sono dinamiche (force-dynamic),
// quindi ogni richiesta vede subito le modifiche fatte dal pannello admin.

type RigaImpostazioni = {
  nome_pub: string
  descrizione: string
  indirizzo: string
  telefono: string
  email: string
  facebook: string
  instagram: string
  orari: string
  stile_sito: string
}

export function getImpostazioni(): Impostazioni {
  const riga = db.prepare('SELECT * FROM impostazioni WHERE id = 1').get() as RigaImpostazioni
  return {
    nomePub: riga.nome_pub,
    descrizione: riga.descrizione,
    indirizzo: riga.indirizzo,
    telefono: riga.telefono,
    email: riga.email,
    facebook: riga.facebook,
    instagram: riga.instagram,
    orari: JSON.parse(riga.orari),
    stileSito: riga.stile_sito === 'onepage' ? 'onepage' : 'multipagina',
  }
}

type RigaPopup = {
  attivo: number
  titolo: string
  messaggio: string
  data_inizio: string | null
  data_fine: string | null
}

export function getPopup(): Popup {
  const riga = db.prepare('SELECT * FROM popup WHERE id = 1').get() as RigaPopup
  return {
    attivo: riga.attivo === 1,
    titolo: riga.titolo,
    messaggio: riga.messaggio,
    dataInizio: riga.data_inizio,
    dataFine: riga.data_fine,
  }
}

export function getCategorie(): Categoria[] {
  return db
    .prepare('SELECT id, nome, ordine FROM categorie ORDER BY ordine, nome')
    .all() as Categoria[]
}

type RigaVoce = {
  id: number
  nome: string
  descrizione: string
  prezzo_centesimi: number
  categoria_id: number
  disponibile: number
  ordine: number
  foto: string | null
}

function vociDaRighe(righe: RigaVoce[]): VoceMenu[] {
  return righe.map((r) => ({
    id: r.id,
    nome: r.nome,
    descrizione: r.descrizione,
    prezzoCentesimi: r.prezzo_centesimi,
    categoriaId: r.categoria_id,
    disponibile: r.disponibile === 1,
    ordine: r.ordine,
    foto: r.foto,
  }))
}

/** Menu pubblico: solo voci disponibili, raggruppate per categoria. */
export function getMenuPubblico(): CategoriaConVoci[] {
  const categorie = getCategorie()
  const voci = vociDaRighe(
    db
      .prepare('SELECT * FROM voci_menu WHERE disponibile = 1 ORDER BY ordine, nome')
      .all() as RigaVoce[]
  )
  return categorie.map((categoria) => ({
    ...categoria,
    voci: voci.filter((voce) => voce.categoriaId === categoria.id),
  }))
}

/** Tutte le voci (anche nascoste), per il pannello admin. */
export function getMenuCompleto(): CategoriaConVoci[] {
  const categorie = getCategorie()
  const voci = vociDaRighe(
    db.prepare('SELECT * FROM voci_menu ORDER BY ordine, nome').all() as RigaVoce[]
  )
  return categorie.map((categoria) => ({
    ...categoria,
    voci: voci.filter((voce) => voce.categoriaId === categoria.id),
  }))
}

export function getVoceMenu(id: number): VoceMenu | null {
  const riga = db.prepare('SELECT * FROM voci_menu WHERE id = ?').get(id) as RigaVoce | undefined
  return riga ? vociDaRighe([riga])[0] : null
}

type RigaEvento = {
  id: number
  titolo: string
  data_ora: string
  descrizione: string
  immagine: string | null
}

function eventiDaRighe(righe: RigaEvento[]): Evento[] {
  return righe.map((r) => ({
    id: r.id,
    titolo: r.titolo,
    dataOra: r.data_ora,
    descrizione: r.descrizione,
    immagine: r.immagine,
  }))
}

/** Eventi futuri: quelli passati spariscono da soli dal sito. */
export function getEventiFuturi(): Evento[] {
  return eventiDaRighe(
    db
      .prepare('SELECT * FROM eventi WHERE data_ora >= ? ORDER BY data_ora')
      .all(adessoInItalia()) as RigaEvento[]
  )
}

/** Tutti gli eventi, per il pannello admin. */
export function getEventi(): Evento[] {
  return eventiDaRighe(
    db.prepare('SELECT * FROM eventi ORDER BY data_ora DESC').all() as RigaEvento[]
  )
}

export function getEvento(id: number): Evento | null {
  const riga = db.prepare('SELECT * FROM eventi WHERE id = ?').get(id) as RigaEvento | undefined
  return riga ? eventiDaRighe([riga])[0] : null
}

type RigaServizio = { id: number; nome: string; logo: string | null; ordine: number; attivo: number }

function serviziDaRighe(righe: RigaServizio[]): Servizio[] {
  return righe.map((r) => ({ ...r, attivo: r.attivo === 1 }))
}

export function getServiziAttivi(): Servizio[] {
  return serviziDaRighe(
    db
      .prepare('SELECT * FROM servizi WHERE attivo = 1 ORDER BY ordine, nome')
      .all() as RigaServizio[]
  )
}

export function getServizi(): Servizio[] {
  return serviziDaRighe(
    db.prepare('SELECT * FROM servizi ORDER BY ordine, nome').all() as RigaServizio[]
  )
}

export function getServizio(id: number): Servizio | null {
  const riga = db.prepare('SELECT * FROM servizi WHERE id = ?').get(id) as RigaServizio | undefined
  return riga ? serviziDaRighe([riga])[0] : null
}

export function getGalleria(): FotoGalleria[] {
  return db
    .prepare('SELECT id, file, didascalia, ordine FROM foto_galleria ORDER BY ordine, id')
    .all() as FotoGalleria[]
}

type RigaPunteggio = { id: number; sigla: string; punteggio: number; creato_il: string }

function punteggiDaRighe(righe: RigaPunteggio[]): Punteggio[] {
  return righe.map((r) => ({
    id: r.id,
    sigla: r.sigla,
    punteggio: r.punteggio,
    creatoIl: r.creato_il,
  }))
}

/** Classifica del gioco: i migliori punteggi, a parità vince il più vecchio. */
export function getClassifica(limite = 10): Punteggio[] {
  return punteggiDaRighe(
    db
      .prepare('SELECT * FROM punteggi ORDER BY punteggio DESC, id ASC LIMIT ?')
      .all(limite) as RigaPunteggio[]
  )
}

/** Tutti i punteggi, per la moderazione dal pannello admin. */
export function getPunteggi(): Punteggio[] {
  return punteggiDaRighe(
    db.prepare('SELECT * FROM punteggi ORDER BY punteggio DESC, id ASC').all() as RigaPunteggio[]
  )
}

/** Salva un punteggio e restituisce la posizione in classifica (1 = primo). */
export function inserisciPunteggio(sigla: string, punteggio: number): number {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO punteggi (sigla, punteggio) VALUES (?, ?)')
    .run(sigla, punteggio)
  const { posizione } = db
    .prepare(
      `SELECT COUNT(*) + 1 AS posizione FROM punteggi
       WHERE punteggio > ? OR (punteggio = ? AND id < ?)`
    )
    .get(punteggio, punteggio, lastInsertRowid) as { posizione: number }
  return posizione
}

function fotoInstagramVetrina(): FotoVetrina[] {
  const righe = db
    .prepare('SELECT file, permalink FROM foto_instagram ORDER BY ordine, id')
    .all() as { file: string; permalink: string }[]
  return righe.map((r) => ({ src: `/uploads/${r.file}`, didascalia: '', href: r.permalink || null }))
}

/**
 * Galleria pubblica: i post Instagram se ce ne sono, altrimenti le foto
 * caricate a mano dal pannello. Così la galleria non resta mai vuota per colpa
 * di Instagram (token scaduto, API giù…).
 */
export function getGalleriaPubblica(): { fonte: 'instagram' | 'manuale'; foto: FotoVetrina[] } {
  const instagram = fotoInstagramVetrina()
  if (instagram.length > 0) return { fonte: 'instagram', foto: instagram }
  const manuali: FotoVetrina[] = getGalleria().map((f) => ({
    src: `/uploads/${f.file}`,
    didascalia: f.didascalia,
    href: null,
  }))
  return { fonte: 'manuale', foto: manuali }
}
