import type Database from 'better-sqlite3'

// Ogni migrazione è atomica e applicata una sola volta, anche con più processi.
export function migra(db: Database.Database) {
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at INTEGER NOT NULL)')
  const migrations: ((db: Database.Database) => void)[] = [
    (db) => {
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

CREATE TABLE IF NOT EXISTS foto_instagram (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ig_id TEXT NOT NULL UNIQUE,        -- id del media su Instagram (dedup)
      file TEXT NOT NULL,                -- foto scaricata e ricompressa in data/uploads
      permalink TEXT NOT NULL DEFAULT '',
      didascalia TEXT NOT NULL DEFAULT '',
      scattata_il TEXT NOT NULL DEFAULT '',
      ordine INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS instagram_stato (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      access_token TEXT NOT NULL DEFAULT '', -- token a lunga durata, server-only
      user_id TEXT NOT NULL DEFAULT '',
      token_scade_il TEXT,
      ultima_sync TEXT,
      ultimo_esito TEXT NOT NULL DEFAULT ''
    );

    INSERT OR IGNORE INTO impostazioni (id) VALUES (1);
    INSERT OR IGNORE INTO popup (id) VALUES (1);
    INSERT OR IGNORE INTO instagram_stato (id) VALUES (1);
`)
      const columns = db.pragma('table_info(impostazioni)') as { name: string }[]
      if (!columns.some((c) => c.name === 'stile_sito')) {
        db.exec("ALTER TABLE impostazioni ADD COLUMN stile_sito TEXT NOT NULL DEFAULT 'onepage'")
      }
    },
    (db) => { db.exec(`
      CREATE TABLE admin_users (
        id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('owner','editor')),
        active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL
      );
      CREATE TABLE admin_sessions (
        token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL, last_seen INTEGER NOT NULL
      );
      CREATE INDEX sessions_user ON admin_sessions(user_id);
      CREATE TABLE login_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
      CREATE TABLE audit_log (id INTEGER PRIMARY KEY, user_id INTEGER, event TEXT NOT NULL, created_at INTEGER NOT NULL);
      CREATE TABLE file_da_eliminare (file TEXT PRIMARY KEY, dopo INTEGER NOT NULL);
      CREATE TABLE maintenance_state (job TEXT PRIMARY KEY, last_run INTEGER NOT NULL);
      ALTER TABLE impostazioni ADD COLUMN branding_json TEXT NOT NULL DEFAULT '{}';
    `)
      const existing = db.prepare('SELECT nome_pub FROM impostazioni WHERE id=1').get() as { nome_pub: string }
      if (existing.nome_pub) db.prepare("UPDATE impostazioni SET branding_json=? WHERE id=1").run(JSON.stringify({legacy:true}))
    },
    (db) => { db.exec(`
      ALTER TABLE instagram_stato ADD COLUMN username TEXT NOT NULL DEFAULT '';
      ALTER TABLE instagram_stato ADD COLUMN verificato_il TEXT;
      ALTER TABLE instagram_stato ADD COLUMN ultimo_tentativo TEXT;
      ALTER TABLE instagram_stato ADD COLUMN ultimo_rinnovo TEXT;
      ALTER TABLE instagram_stato ADD COLUMN errore_codice TEXT NOT NULL DEFAULT '';
      ALTER TABLE instagram_stato ADD COLUMN revisione INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE foto_instagram ADD COLUMN nascosta INTEGER NOT NULL DEFAULT 0;
      CREATE TABLE galleria_config (
        id INTEGER PRIMARY KEY CHECK(id=1),
        fonte TEXT NOT NULL DEFAULT 'automatica' CHECK(fonte IN ('automatica','manuale','instagram','mista')),
        includi_reel INTEGER NOT NULL DEFAULT 0
      );
      INSERT INTO galleria_config(id) VALUES(1);
      CREATE TABLE instagram_oauth (
        state_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL, revisione INTEGER NOT NULL
      );
      CREATE TABLE integration_locks (job TEXT PRIMARY KEY, token TEXT NOT NULL, expires_at INTEGER NOT NULL);
      CREATE TABLE maintenance_health (
        id INTEGER PRIMARY KEY CHECK(id=1), heartbeat INTEGER, last_success INTEGER,
        error TEXT NOT NULL DEFAULT ''
      );
      INSERT INTO maintenance_health(id) VALUES(1);
      UPDATE instagram_stato SET ultimo_tentativo=ultima_sync,
        ultima_sync=CASE WHEN ultimo_esito LIKE 'Sincronizzate %' THEN ultima_sync ELSE NULL END;
      -- Le vecchie scadenze erano stime di 60 giorni, non dati verificati da Meta.
      UPDATE instagram_stato SET token_scade_il=NULL;
    `) },
  ]
  const latest = (db.prepare('SELECT MAX(version) AS v FROM schema_migrations').get() as {v:number|null}).v || 0
  if (latest > migrations.length) throw new Error('Database più recente del codice: aggiorna l’applicazione.')
  migrations.forEach((run, index) => {
    db.transaction(() => {
      if (db.prepare('SELECT 1 FROM schema_migrations WHERE version = ?').get(index + 1)) return
      run(db)
      db.prepare('INSERT INTO schema_migrations VALUES (?, ?)').run(index + 1, Date.now())
    }).immediate()
  })
}
