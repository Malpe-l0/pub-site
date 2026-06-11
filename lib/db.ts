import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

// Tutti i dati vivono in DATA_DIR (default ./data): database e foto caricate.
// Backup del sito = copia di questa cartella.
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// In sviluppo il modulo può essere ricaricato a ogni modifica: riusiamo la
// stessa connessione per non esaurire i file descriptor.
const globale = globalThis as unknown as { __db?: Database.Database }

// La build di Next apre il database da più worker in parallelo: la creazione
// dello schema può trovare il file momentaneamente bloccato (SQLITE_BUSY).
// In quel caso si aspetta e si riprova: l'operazione è idempotente.
function attesaSincrona(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function apri(): Database.Database {
  const db = new Database(path.join(DATA_DIR, 'pub.db'), { timeout: 10000 })

  for (let tentativo = 0; ; tentativo++) {
    try {
      inizializza(db)
      return db
    } catch (errore) {
      const codice = (errore as { code?: string }).code
      if (codice !== 'SQLITE_BUSY' || tentativo >= 20) throw errore
      attesaSincrona(100)
    }
  }
}

function inizializza(db: Database.Database) {
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS impostazioni (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      nome_pub TEXT NOT NULL DEFAULT '',
      descrizione TEXT NOT NULL DEFAULT '',
      indirizzo TEXT NOT NULL DEFAULT '',
      telefono TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      facebook TEXT NOT NULL DEFAULT '',
      instagram TEXT NOT NULL DEFAULT '',
      orari TEXT NOT NULL DEFAULT '[]', -- JSON: [{giorni, orario}]
      stile_sito TEXT NOT NULL DEFAULT 'onepage' -- 'onepage' | 'multipagina'
    );

    CREATE TABLE IF NOT EXISTS popup (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      attivo INTEGER NOT NULL DEFAULT 0,
      titolo TEXT NOT NULL DEFAULT '',
      messaggio TEXT NOT NULL DEFAULT '',
      data_inizio TEXT,
      data_fine TEXT
    );

    CREATE TABLE IF NOT EXISTS categorie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      ordine INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS voci_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descrizione TEXT NOT NULL DEFAULT '',
      prezzo_centesimi INTEGER NOT NULL,
      categoria_id INTEGER NOT NULL REFERENCES categorie(id) ON DELETE CASCADE,
      disponibile INTEGER NOT NULL DEFAULT 1,
      ordine INTEGER NOT NULL DEFAULT 0,
      foto TEXT
    );

    CREATE TABLE IF NOT EXISTS eventi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titolo TEXT NOT NULL,
      data_ora TEXT NOT NULL, -- YYYY-MM-DDTHH:MM, ora italiana
      descrizione TEXT NOT NULL DEFAULT '',
      immagine TEXT
    );

    CREATE TABLE IF NOT EXISTS servizi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      logo TEXT,
      ordine INTEGER NOT NULL DEFAULT 0,
      attivo INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS foto_galleria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file TEXT NOT NULL,
      didascalia TEXT NOT NULL DEFAULT '',
      ordine INTEGER NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO impostazioni (id) VALUES (1);
    INSERT OR IGNORE INTO popup (id) VALUES (1);
  `)

  // Colonne aggiunte dopo la prima versione: sui database già esistenti la
  // CREATE TABLE non basta, serve l'ALTER (che fallisce se già applicato).
  try {
    db.exec(
      `ALTER TABLE impostazioni ADD COLUMN stile_sito TEXT NOT NULL DEFAULT 'onepage'`
    )
  } catch {
    // colonna già presente
  }
}

export const db = globale.__db ?? (globale.__db = apri())
