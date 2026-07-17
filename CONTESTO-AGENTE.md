# Chelsea House (pub-site) — Contesto di base

Handoff per il redesign estetico del sito. **L'estetica va ripensata da zero:
nessuna indicazione visiva qui dentro, e il look attuale nel codice va trattato
come segnaposto da sostituire, non come riferimento.**

## Cos'è

Sito vetrina del **Chelsea House**, british pub e **birreria** di Imola (BO),
attivo dal 1993. Viale Domenico Rivalta 99/A · tel 0542 27413 · aperto tutti i
giorni la sera (dom–gio 20:30–02:30, ven–sab fino alle 03:00).

**Mission**: far trovare in pochi secondi orari, menu coi prezzi, contatti e
posizione, e trasmettere l'atmosfera del locale. Gli utenti arrivano quasi
sempre **da telefono, la sera**, per una decisione rapida. Utente secondario:
il gestore, **non tecnico**, che aggiorna i contenuti dal pannello `/admin`.

**Focus di contenuto: le birre.** Sono la cosa più importante del sito.

## Stack e architettura

- **Next.js 16.2.9** (App Router) — ⚠️ versione con breaking changes rispetto
  ai training data: consultare `node_modules/next/dist/docs/`. Il middleware
  si chiama `proxy.ts`.
- TypeScript · React · **Tailwind CSS v4** (token nel blocco `@theme` di
  `app/globals.css`; font via next/font in `app/fonts.ts`).
- Dati: **SQLite** locale (`better-sqlite3`, file `data/pub.db`), letture in
  `lib/dati.ts`, tipi in `lib/tipi.ts`. Foto: `sharp` → webp in `data/uploads/`.
- Niente CMS, **niente servizi esterni**. Pagine dinamiche (ogni richiesta
  legge il DB).

```
proxy.ts                    # lingua IT/EN (cookie + Accept-Language)
app/[lang]/(sito)/          # pubblico: layout (nav+footer+popup), home,
                            #   menu/, galleria/, dove/
app/admin/                  # pannello gestore (stile e layout SEPARATI)
app/uploads/[file]/route.ts # serve le foto caricate
lib/dizionario.ts           # tutti i testi UI in it/en
components/sito/            # NavTaproom, CartaMenu, MuroBirre
components/Popup.tsx        # avvisi <dialog>
```

- **Bilingue**: italiano su URL puliti (`/menu`), inglese su `/en/...`.
  Ogni testo UI vive in `lib/dizionario.ts` in entrambe le lingue — mai
  stringhe hardcoded nei componenti pubblici.

## Contenuti (dal pannello, in italiano)

- **Menu**: categorie + voci con prezzo e foto; le birre oggi sono categorie
  del menu. Le 6 birre alla spina in home sono invece statiche nel codice
  (`MuroBirre.tsx`).
- **Popup avvisi** con date (es. pausa estiva).
- **Impostazioni**: nome, descrizione, indirizzo, telefono, social, orari.
- **Galleria**: upload o feed Instagram (cacheato in locale).
- **Eventi e servizi TV** (Sky/DAZN): nel pannello, oggi non esposti in home.

## Vincoli tecnici (non estetici)

1. Mobile-first: il pubblico è al telefono, la sera.
2. **Un solo tema**: `color-scheme: only light` — niente dark mode.
3. Accessibilità: contrasti AA, `prefers-reduced-motion`, target tap ≥ 44px.
4. Il pannello `/admin` non si tocca (stile proprio, sempre in italiano).
5. Ogni server action del pannello inizia con `await richiediAdmin()`; il
   token Instagram non deve mai raggiungere il client.
6. Niente dipendenze o servizi esterni nuovi senza necessità.
7. I nuovi valori visivi vanno espressi nei token (`globals.css` + `fonts.ts`),
   non sparsi nei componenti.
