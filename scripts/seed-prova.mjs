// Dati di prova per lo sviluppo: node scripts/seed-prova.mjs
// Riempie il database con contenuti finti per vedere il sito popolato.
import Database from 'better-sqlite3'
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const UPLOADS = path.join(DATA_DIR, 'uploads')
fs.mkdirSync(UPLOADS, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'pub.db'))
db.pragma('journal_mode = WAL')

async function immagineDiProva(nome, colore) {
  const file = `${nome}.webp`
  await sharp({
    create: { width: 600, height: 400, channels: 3, background: colore },
  })
    .webp()
    .toFile(path.join(UPLOADS, file))
  return file
}

const fotoLocale = await immagineDiProva('prova-locale', { r: 120, g: 80, b: 40 })
const logoSky = await immagineDiProva('prova-logo', { r: 20, g: 40, b: 120 })

db.prepare(
  `UPDATE impostazioni SET nome_pub = ?, descrizione = ?, indirizzo = ?, telefono = ?, email = ?, orari = ? WHERE id = 1`
).run(
  'Pub di Prova',
  'Birre artigianali e cucina fino a tardi.',
  'Via Roma 1, Catania',
  '095 123 4567',
  'info@pubdiprova.it',
  JSON.stringify([
    { giorni: 'Lunedì – Giovedì', orario: '18:00 – 01:00' },
    { giorni: 'Venerdì – Domenica', orario: '18:00 – 02:00' },
  ])
)

db.prepare(
  `UPDATE popup SET attivo = 1, titolo = ?, messaggio = ?, data_inizio = NULL, data_fine = NULL WHERE id = 1`
).run('Pausa estiva', 'Chiudiamo dal 10 al 25 agosto, ci vediamo al rientro!')

const birre = db.prepare(`INSERT INTO categorie (nome, ordine) VALUES ('Birre alla spina', 0)`).run()
const panini = db.prepare(`INSERT INTO categorie (nome, ordine) VALUES ('Panini', 1)`).run()

const voce = db.prepare(
  `INSERT INTO voci_menu (nome, descrizione, prezzo_centesimi, categoria_id, disponibile, ordine) VALUES (?, ?, ?, ?, ?, ?)`
)
voce.run('IPA artigianale', 'Media 0,4l', 550, birre.lastInsertRowid, 1, 0)
voce.run('Lager', 'Media 0,4l', 450, birre.lastInsertRowid, 1, 1)
voce.run('Panino del pub', 'Hamburger, cheddar, bacon', 950, panini.lastInsertRowid, 1, 0)
voce.run('Voce nascosta', 'Non deve comparire sul sito', 100, panini.lastInsertRowid, 0, 1)

const domani = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16)
db.prepare(`INSERT INTO eventi (titolo, data_ora, descrizione) VALUES (?, ?, ?)`).run(
  'Serata quiz',
  domani,
  'Premi per i primi tre classificati.'
)
db.prepare(`INSERT INTO eventi (titolo, data_ora, descrizione) VALUES (?, ?, ?)`).run(
  'Evento passato',
  '2020-01-01T21:00',
  'Non deve comparire sul sito.'
)

db.prepare(`INSERT INTO servizi (nome, logo, ordine, attivo) VALUES ('Sky', ?, 0, 1)`).run(logoSky)
db.prepare(`INSERT INTO servizi (nome, logo, ordine, attivo) VALUES ('Serie A', NULL, 1, 1)`).run()

db.prepare(`INSERT INTO foto_galleria (file, didascalia, ordine) VALUES (?, 'Il bancone', 0)`).run(
  fotoLocale
)

console.log('Dati di prova inseriti.')
