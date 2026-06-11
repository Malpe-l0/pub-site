# Spec — Vestizione demo "assaggio di pub" (Chelsea House)

Data: 2026-06-11 · Stato: approvata a voce, in revisione scritta

## Contesto e obiettivo

Il sito vetrina del Chelsea House (birreria, est. 1993) è funzionalmente completo
(menu, eventi, galleria, pop-up, carosello loghi, pannello admin custom su SQLite)
ma senza stile. Serve renderlo **presentabile per una demo in locale al gestore**,
il cui scopo è mostrare le funzionalità. Lo stile definitivo verrà deciso in
seguito: questa vestizione è un "assaggio di pub" che dovrà fare da base al design
finale, non essere buttato.

Decisioni prese durante il brainstorming:

| Decisione | Scelta |
|---|---|
| Livello di rifinitura | B — "assaggio di pub" (palette dallo stemma, serif, filetti) |
| Dove si vede la demo | In locale (hosting rimandato) |
| Contenuti | Seed plausibile "Chelsea House" + stemma vero |
| Tecnologia stile | Tailwind CSS v4 + next/font |

## Fondazione

**Tailwind CSS v4** (`tailwindcss` + `@tailwindcss/postcss`), tema definito in
`app/globals.css` con blocco `@theme`. Token:

| Token | Hex | Uso |
|---|---|---|
| `verde` | `#1F3D2B` | header, footer, titoli su chiaro |
| `ottone` | `#8A6D1F` | filetti, bordi, riga "dal 1993" |
| `oro` | `#D4B14A` | accenti su fondo scuro |
| `crema` | `#F5F1E8` | sfondo pagine |
| `pergamena` | `#FFFDF7` | card e pannelli |
| `inchiostro` | `#2B2418` | testo su chiaro |

**Font** con `next/font/google` (self-hostati, zero richieste esterne):
- **IM Fell English** (regular + italic) → titoli, variabile `--font-titoli`
- **Lora** (variable) → testo, variabile `--font-testo`

Niente font gotici nei testi: il gotico lo porta lo stemma.

Le classi strutturali del carosello (`.carosello*`) restano in `globals.css`.

## Applicazione per area

- **Header** (`components/Navigazione.tsx`): fondo verde, stemma (h ~40px) +
  nome a sinistra, nav a destra in oro/crema. Su mobile i link vanno a capo;
  niente hamburger (2–4 voci). Identico nelle due strutture (multipagina/one-page).
- **Home — hero**: fondo crema, stemma centrato (~180px), "Chelsea House" in
  IM Fell grande, sotto in ottone maiuscoletto spaziato "BIRRERIA DAL 1993",
  poi la descrizione dalle impostazioni.
- **Titoli di sezione** (Prossimi eventi, Menu, Galleria, Da noi trovi):
  IM Fell, verde, filetto doppio in ottone (`border-bottom: double`).
- **Menu** (`components/ListaMenu.tsx`): per ogni voce riga
  nome–puntini–prezzo (leader dotted via flex + `border-bottom dotted`),
  descrizione sotto in corpo minore, eventuale foto piccola (~96px) a destra.
- **Eventi** (`components/SezioneEventi.tsx`): card pergamena con bordo
  sottile; a sinistra blocchetto data stile calendario (giorno grande, mese),
  a destra titolo/descrizione; immagine sotto se presente.
- **Galleria** (`components/GalleriaFoto.tsx`): griglia
  `repeat(auto-fill, minmax(240px, 1fr))`, foto con angoli appena smussati,
  didascalia sotto in corsivo.
- **Carosello loghi**: striscia su crema, loghi altezza 56–64px, a colori
  originali (nessun filtro/viraggio: sono marchi commerciali riconoscibili).
- **Footer** (`app/(sito)/layout.tsx`): verde scuro, testo crema, tre blocchi
  (contatti, orari, social) in colonna su mobile e affiancati da tablet in su.
- **Pop-up** (`components/Popup.tsx`): `<dialog>` pergamena, bordo ottone,
  titolo IM Fell, `::backdrop` scuro semitrasparente, bottone "Chiudi" verde.
- **Responsive**: mobile-first; la demo verrà guardata anche da telefono.

## Pannello admin

Minimo sindacale, stessa palette in versione sobria: nav del pannello su verde,
form incolonnati (etichette sopra i campi), input con bordo visibile, bottoni
primari verdi e azioni distruttive in rosso mattone, tabelle/elenchi con righe
separate. Nessun lavoro estetico oltre la leggibilità.

## Contenuti demo e stemma

Nuovo script `scripts/seed-demo.mjs` (il vecchio `seed-prova.mjs` resta):

- **Impostazioni**: nome "Chelsea House", descrizione credibile, indirizzo e
  telefono fittizi ma realistici, orari su due fasce, link social segnaposto.
- **Menu**: 4–5 categorie (Birre alla spina, Birre in bottiglia, Panini &
  burger, Fritti, Dolci) con ~14 voci totali e prezzi realistici.
- **Eventi**: 2 futuri (serata quiz, musica live) con descrizione.
- **Pop-up**: precompilato ("Pausa estiva", date di agosto) ma **spento** —
  da accendere dal vivo durante la demo, è il momento "wow".
- **Servizi**: 3 loghi segnaposto generati con sharp (rettangolo colorato con
  il nome: "SKY", "DAZN", "SERIE A") — i veri loghi li caricherà Gabriele.
- **Galleria**: 5 foto segnaposto generate con sharp in toni caldi, con
  didascalie — da sostituire con foto vere dal pannello.

**Stemma**: Gabriele fornisce il file (PNG con fondo bianco o trasparente) da
salvare come `public/stemma.png`. Header e hero lo mostrano; se il file manca
il sito mostra solo il nome (nessun errore).

## Fuori perimetro

Hosting/messa online, lightbox galleria, animazioni (motion), font gotico,
SEO/JSON-LD, campi allergeni, modifica rapida prezzi, riordino drag&drop.
Tutto rimandato a decisioni successive alla demo.

## Verifica / criteri di accettazione

1. `npm run build` verde; `npm run lint` senza errori.
2. Con `seed-demo.mjs`: home, menu e galleria presentabili in **entrambe** le
   strutture (multipagina e one-page, commutando dalle Impostazioni).
3. Controllo visivo a viewport 375px (telefono) e 1280px (desktop): niente
   overflow orizzontali, testi leggibili, nav usabile.
4. Pop-up: acceso dal pannello compare stilizzato, si chiude, non riappare
   nella stessa sessione.
5. Flusso admin invariato: login, modifica voce, salvataggio impostazioni
   (riverifica rapida come già fatto via curl).
6. Senza `public/stemma.png` il sito renderizza comunque.
