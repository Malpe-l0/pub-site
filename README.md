# Sito vetrina del pub

Sito vetrina in Next.js (React) con pannello admin **costruito in casa**:
niente CMS, niente servizi esterni. Database SQLite in un file, foto su disco,
login a password. Pensato per essere gestito da una persona non tecnica.

## Cosa fa

- **Menu modificabile** dal pannello: categorie, voci, prezzi, foto; ogni voce
  ha un pulsante Nascondi/Mostra per toglierla dal sito senza cancellarla.
- **Pop-up avvisi** (es. pausa estiva): si accende/spegne dal pannello, con
  date di inizio/fine opzionali; compare e sparisce da solo nelle date scelte.
- **Sezione eventi** in home: compare solo se ci sono eventi futuri; quelli
  passati spariscono da soli dal sito (nel pannello restano, per riusarli).
- **Carosello loghi servizi** (Sky, Serie A, ...): gestibile dal pannello.
- **Galleria fotografica**: pagina `/galleria` con caricamento multiplo; il
  link in navigazione compare solo se ci sono foto.
- **Pannello admin** in italiano su `/admin`, protetto da password.
- **Struttura a scelta**: dalle Impostazioni si passa con un click tra
  **multipagina** (menu e galleria su pagine proprie) e **pagina unica**
  (tutto in home, barra di navigazione con ancore alle sezioni). In entrambe
  le modalità `/menu` e `/galleria` restano raggiungibili (comodo per QR code
  e Google).

## Come funziona

- **Dati**: SQLite (`better-sqlite3`) in `data/pub.db`, schema creato in
  automatico al primo avvio ([lib/db.ts](lib/db.ts)). Letture in
  [lib/dati.ts](lib/dati.ts). Le pagine sono dinamiche: ogni richiesta legge il
  database, quindi le modifiche dal pannello sono online all'istante, senza
  cache né webhook.
- **Foto**: caricate dal pannello, ridimensionate e convertite in webp con
  sharp ([lib/upload.ts](lib/upload.ts)), salvate in `data/uploads/` e servite
  da [app/uploads/[file]/route.ts](app/uploads/%5Bfile%5D/route.ts).
- **Login**: un solo utente; password in `ADMIN_PASSWORD`, sessione in un
  cookie httpOnly firmato HMAC ([lib/auth.ts](lib/auth.ts)). Ogni pagina e ogni
  azione del pannello rifanno il controllo.
- **Backup** = copiare la cartella `data/` (database + foto).

```
app/
├── (sito)/                     # pagine pubbliche (header, footer, pop-up)
│   ├── page.tsx                # home: presentazione, eventi, carosello
│   ├── menu/  galleria/
├── admin/
│   ├── login/                  # accesso
│   └── (pannello)/             # sezioni protette: menu, eventi, galleria,
│                               # servizi, popup, impostazioni
└── uploads/[file]/route.ts     # serve le foto caricate
components/                     # componenti del sito e del pannello
lib/                            # db, dati, auth, upload, date italiane
scripts/seed-prova.mjs          # dati finti per lo sviluppo
```

## Avvio in locale

```bash
cp .env.local.example .env.local   # poi compila ADMIN_PASSWORD e SESSION_SECRET
npm install
npm run dev                        # sito su http://localhost:3000, pannello su /admin
node scripts/seed-prova.mjs        # (facoltativo) riempie il sito di dati finti
```

`SESSION_SECRET` dev'essere una stringa lunga e casuale: `openssl rand -base64 32`.

## Messa online (Fase 3)

Serve un host con disco persistente e Node (es. un VPS da ~5€/mese — il piano
gratuito di Vercel non va bene perché serverless non ha disco):

1. `npm run build && npm start` dietro un reverse proxy (Caddy o nginx) con
   HTTPS; il cookie di sessione in produzione è `secure`.
2. Variabili d'ambiente: `ADMIN_PASSWORD`, `SESSION_SECRET`, ed eventualmente
   `DATA_DIR` (es. `/var/lib/pub-site`) per tenere i dati fuori dalla cartella
   del codice.
3. Backup periodico della cartella dati (un `rsync`/`tar` in cron basta).
4. Consegna al gestore: indirizzo `https://<dominio>/admin` e password.

## Fasi successive

- **Fase 2 (design, ~fine luglio)**: i componenti sono headless e il markup è
  semantico: lo stile si applica senza toccare la logica. In
  [globals.css](app/globals.css) c'è solo il minimo strutturale del carosello.
- **Fase 3 (go-live)**: vedi sopra.
