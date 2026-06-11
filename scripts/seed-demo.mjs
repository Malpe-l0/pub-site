// Contenuti demo realistici per il Chelsea House: node scripts/seed-demo.mjs
// Da eseguire su database vuoto (cancellare prima la cartella data/ se serve).
import Database from 'better-sqlite3'
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const UPLOADS = path.join(DATA_DIR, 'uploads')
fs.mkdirSync(UPLOADS, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'pub.db'))
db.pragma('journal_mode = WAL')

// --- immagini segnaposto (sharp renderizza l'SVG, testo compreso) ---

async function logoSegnaposto(file, testo, colore) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
    <rect width="400" height="200" rx="16" fill="${colore}"/>
    <text x="200" y="120" font-family="Arial, Helvetica, sans-serif" font-size="56"
      font-weight="bold" fill="#ffffff" text-anchor="middle">${testo}</text>
  </svg>`
  await sharp(Buffer.from(svg)).webp().toFile(path.join(UPLOADS, file))
  return file
}

async function fotoSegnaposto(file, etichetta, colore) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colore}"/><stop offset="1" stop-color="#241c14"/>
    </linearGradient></defs>
    <rect width="1200" height="900" fill="url(#g)"/>
    <text x="600" y="470" font-family="Georgia, serif" font-size="64" fill="#e8dcc0"
      text-anchor="middle">${etichetta}</text>
  </svg>`
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(path.join(UPLOADS, file))
  return file
}

// --- impostazioni e pop-up ---

db.prepare(
  `UPDATE impostazioni SET nome_pub=?, descrizione=?, indirizzo=?, telefono=?, email=?,
   facebook=?, instagram=?, orari=?, stile_sito='onepage' WHERE id=1`
).run(
  'Chelsea House',
  'Birre alla spina, cucina fino a tardi e trent’anni di serate tra mattoni e legno.',
  'Via dei Malti 12, Catania',
  '095 123 4567',
  'info@chelseahouse.it',
  'https://www.facebook.com/chelseahousepub',
  'https://www.instagram.com/chelseahousepub',
  JSON.stringify([
    { giorni: 'Martedì – Domenica', orario: '18:00 – 01:00' },
    { giorni: 'Lunedì', orario: 'Chiuso' },
  ])
)

// Pop-up pronto ma SPENTO: si accende dal vivo durante la demo.
db.prepare(
  `UPDATE popup SET attivo=0, titolo=?, messaggio=?, data_inizio=?, data_fine=? WHERE id=1`
).run(
  'Pausa estiva',
  'Chiudiamo dal 10 al 25 agosto: ci rivediamo al rientro, con le spine fresche.',
  '2026-08-10',
  '2026-08-25'
)

// --- menu ---

const categoria = db.prepare('INSERT INTO categorie (nome, ordine) VALUES (?, ?)')
const voce = db.prepare(
  `INSERT INTO voci_menu (nome, descrizione, prezzo_centesimi, categoria_id, disponibile, ordine)
   VALUES (?, ?, ?, ?, 1, ?)`
)

const spina = categoria.run('Birre alla spina', 0).lastInsertRowid
voce.run('Guinness', 'Stout irlandese, pinta', 600, spina, 0)
voce.run('Kilkenny', 'Red ale cremosa, pinta', 600, spina, 1)
voce.run('IPA della casa', 'Artigianale siciliana, 0,4 l', 550, spina, 2)
voce.run('Lager', 'Chiara, 0,4 l', 450, spina, 3)

const bottiglia = categoria.run('Birre in bottiglia', 1).lastInsertRowid
voce.run('Chimay Bleue', 'Trappista belga, 33 cl', 650, bottiglia, 0)
voce.run('Fuller’s London Pride', 'Ale inglese, 50 cl', 700, bottiglia, 1)
voce.run('Weihenstephaner', 'Weiss bavarese, 50 cl', 600, bottiglia, 2)

const panini = categoria.run('Panini & burger', 2).lastInsertRowid
voce.run('Chelsea burger', 'Manzo 200 g, cheddar, bacon, salsa della casa', 950, panini, 0)
voce.run('Pulled pork', 'Maiale sfilacciato, coleslaw, BBQ', 900, panini, 1)
voce.run('Club sandwich', 'Pollo, uovo, bacon, triplo strato', 850, panini, 2)
voce.run('Veggie burger', 'Burger di ceci, verdure grigliate', 800, panini, 3)

const fritti = categoria.run('Fritti', 3).lastInsertRowid
voce.run('Fish & chips', 'Merluzzo in pastella di birra, patatine', 1000, fritti, 0)
voce.run('Onion rings', 'Anelli di cipolla, salsa cheddar', 500, fritti, 1)
voce.run('Patatine rustiche', 'Con buccia, doppia cottura', 400, fritti, 2)

const dolci = categoria.run('Dolci', 4).lastInsertRowid
voce.run('Cheesecake', 'Ai frutti di bosco', 500, dolci, 0)
voce.run('Brownie', 'Cioccolato fondente, gelato alla vaniglia', 550, dolci, 1)

// --- eventi futuri (date calcolate, così la demo non scade mai) ---

function traGiorni(n, ora) {
  const d = new Date(Date.now() + n * 24 * 3600 * 1000)
  return `${d.toISOString().slice(0, 10)}T${ora}`
}

const evento = db.prepare('INSERT INTO eventi (titolo, data_ora, descrizione) VALUES (?, ?, ?)')
evento.run('Serata quiz', traGiorni(3, '21:00'), 'A squadre, max 6 persone. In palio una cassa di birra artigianale.')
evento.run('Live: blues al Chelsea', traGiorni(10, '22:00'), 'Trio blues dal vivo, ingresso libero.')

// --- servizi: loghi SVG ufficiali da scripts/loghi-demo/ se presenti,
// --- altrimenti segnaposto generati ---

const LOGHI_DEMO = path.join(process.cwd(), 'scripts', 'loghi-demo')

async function logoDemo(slug, testo, colore) {
  const sorgente = path.join(LOGHI_DEMO, `${slug}.svg`)
  if (fs.existsSync(sorgente)) {
    const file = `demo-logo-${slug}.svg`
    fs.copyFileSync(sorgente, path.join(UPLOADS, file))
    return file
  }
  return logoSegnaposto(`demo-logo-${slug}.webp`, testo, colore)
}

const servizio = db.prepare('INSERT INTO servizi (nome, logo, ordine, attivo) VALUES (?, ?, ?, 1)')
servizio.run('Sky Sport', await logoDemo('sky', 'SKY', '#1b2a6b'), 0)
servizio.run('DAZN', await logoDemo('dazn', 'DAZN', '#0a0a0a'), 1)
servizio.run('Serie A', await logoDemo('serie-a', 'SERIE A', '#0b6e4f'), 2)

// --- galleria (foto segnaposto in toni caldi: da sostituire con foto vere) ---

const foto = db.prepare('INSERT INTO foto_galleria (file, didascalia, ordine) VALUES (?, ?, ?)')
foto.run(await fotoSegnaposto('demo-foto-bancone.webp', 'Il bancone', '#6b4a2b'), 'Il bancone', 0)
foto.run(await fotoSegnaposto('demo-foto-sala.webp', 'La sala', '#7a5a35'), 'La sala grande', 1)
foto.run(await fotoSegnaposto('demo-foto-spine.webp', 'Le spine', '#52381f'), 'Le nostre spine', 2)
foto.run(await fotoSegnaposto('demo-foto-giardino.webp', 'Il giardino', '#4a5a2b'), 'Il giardino', 3)
foto.run(await fotoSegnaposto('demo-foto-vetrina.webp', 'La vetrina', '#8a6d1f'), 'La vetrina sulla via', 4)

console.log('Demo Chelsea House pronta: npm run dev e buona visione.')
