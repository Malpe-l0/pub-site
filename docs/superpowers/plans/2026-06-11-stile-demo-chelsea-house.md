# Vestizione demo "assaggio di pub" — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vestire il sito Chelsea House (funzionalmente completo, oggi senza stile) al livello "assaggio di pub" per la demo locale al gestore, con seed di contenuti realistici.

**Architecture:** Tailwind CSS v4 con token di tema (palette dallo stemma + 2 font self-hostati via next/font) definiti in `app/globals.css`; classi utility applicate ai componenti esistenti senza toccarne la logica. Admin stilato con regole element-scoped sotto `.admin`. Nessuna modifica a dati o server action, tranne due piccoli helper di presentazione.

**Tech Stack:** Next.js 16 (App Router, Turbopack), Tailwind CSS v4 (`@tailwindcss/postcss`), next/font (IM Fell English, Lora), sharp (immagini segnaposto del seed).

**Spec:** `docs/superpowers/specs/2026-06-11-stile-demo-chelsea-house-design.md`

**Contesto repo:** progetto in `pub-site/`. Le pagine pubbliche sono `force-dynamic` e leggono SQLite a ogni richiesta. `.env.local` di sviluppo esiste già (password `admin-di-prova`). Il lavoro funzionale di Fase 1 NON è ancora committato: il Task 0 lo mette al sicuro.

**Nota verifica:** è un lavoro di presentazione: non ci sono unit test da scrivere. Il ciclo per ogni task è: modifica → `npm run build` (o dev server + curl) → controllo visivo → commit. I criteri di accettazione finali sono nel Task 11.

---

### Task 0: Commit dello stato attuale

**Files:** nessuna modifica, solo git.

- [ ] **Step 1: Verificare cosa c'è di non committato**

Run: `git -C "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site" status --short | head -30`
Expected: molti file di app/, components/, lib/, scripts/ in stato `??` o `M`.

- [ ] **Step 2: Commit della Fase 1 funzionale**

```bash
cd "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site"
git add -A
git commit -m "Fase 1: sito funzionale con pannello admin custom (SQLite, auth, upload)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

Expected: commit creato; `git status` pulito (salvo `.env.local`, `data/`, `.superpowers/` ignorati).

---

### Task 1: Tailwind v4 + tema Chelsea

**Files:**
- Create: `postcss.config.mjs`
- Modify: `app/globals.css` (riscrittura completa)

- [ ] **Step 1: Installare Tailwind**

```bash
cd "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site"
npm install tailwindcss @tailwindcss/postcss
```

- [ ] **Step 2: Creare `postcss.config.mjs`**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

- [ ] **Step 3: Riscrivere `app/globals.css`**

Sostituire l'intero contenuto con:

```css
@import 'tailwindcss';

/*
 * Tema "assaggio di pub" — palette presa dallo stemma del Chelsea House.
 * I font sono esposti come variabili da next/font nel root layout.
 */
@theme {
  --color-verde: #1f3d2b;
  --color-ottone: #8a6d1f;
  --color-oro: #d4b14a;
  --color-crema: #f5f1e8;
  --color-pergamena: #fffdf7;
  --color-inchiostro: #2b2418;

  --font-titoli: var(--font-im-fell);
  --font-testo: var(--font-lora);
}

body {
  background: var(--color-crema);
  color: var(--color-inchiostro);
  font-family: var(--font-testo), Georgia, serif;
}

/* Pop-up avvisi: l'elemento <dialog> nativo, vestito da pannello pergamena. */
dialog {
  margin: auto;
  max-width: 28rem;
  border: 2px solid var(--color-ottone);
  border-radius: 6px;
  background: var(--color-pergamena);
  color: var(--color-inchiostro);
  padding: 1.5rem 2rem;
}

dialog::backdrop {
  background: rgb(0 0 0 / 0.55);
}

/* Strutturale per embla-carousel (non estetico). */
.carosello {
  overflow: hidden;
}

.carosello-contenitore {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.carosello-slide {
  flex: 0 0 auto;
}

/*
 * Pannello admin: "minimo sindacale" — regole element-scoped sotto .admin
 * così non serve toccare ogni form del pannello.
 */
.admin h1 {
  font-family: var(--font-titoli), Georgia, serif;
  color: var(--color-verde);
  font-size: 1.6rem;
  margin: 1.25rem 0 0.75rem;
}

.admin h2 {
  color: var(--color-verde);
  font-size: 1.15rem;
  margin: 1.25rem 0 0.5rem;
}

.admin label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
}

.admin input:not([type='checkbox']):not([type='radio']):not([type='file']),
.admin textarea,
.admin select {
  display: block;
  width: 100%;
  max-width: 28rem;
  border: 1px solid #b8a878;
  border-radius: 4px;
  background: #fff;
  padding: 0.45rem 0.6rem;
  margin-top: 0.2rem;
  font: inherit;
}

.admin button {
  background: var(--color-verde);
  color: #fff;
  border: 0;
  border-radius: 4px;
  padding: 0.45rem 1rem;
  margin-top: 0.4rem;
  cursor: pointer;
  font: inherit;
}

.admin details button {
  background: #8c2f1b; /* azioni distruttive: rosso mattone */
}

.admin details summary {
  cursor: pointer;
  color: #8c2f1b;
  font-size: 0.9rem;
}

.admin p {
  margin: 0.5rem 0;
}

.admin ul {
  padding-left: 1.1rem;
}

.admin li {
  margin: 0.6rem 0;
}
```

- [ ] **Step 4: Verificare la build**

Run: `cd "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site" && npm run build 2>&1 | tail -5`
Expected: build verde (le pagine restano ƒ dynamic).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json postcss.config.mjs app/globals.css
git commit -m "Stile: Tailwind v4 con tema Chelsea (palette stemma, dialog, admin base)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Font self-hostati nel root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Aggiungere next/font**

Riscrivere `app/layout.tsx` così (cambiano solo import font e tag `<html>`):

```tsx
import type { Metadata } from 'next'
import { IM_Fell_English, Lora } from 'next/font/google'
import { getImpostazioni } from '@/lib/dati'
import './globals.css'

const imFell = IM_Fell_English({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-im-fell',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export async function generateMetadata(): Promise<Metadata> {
  const impostazioni = getImpostazioni()
  const nome = impostazioni.nomePub || 'Il nostro pub'
  return {
    title: { default: nome, template: `%s — ${nome}` },
    description: impostazioni.descrizione || undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${imFell.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Verifica visiva rapida**

```bash
cd "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site"
npm run dev -- --port 3199 &   # lasciare attivo per i task successivi
sleep 5 && curl -s http://localhost:3199/ | grep -c "__variable"
```

Expected: ≥ 1 (next/font genera classi `__variable_<hash>` sull'`<html>`; il
nome leggibile `font-im-fell` NON compare nell'HTML, non cercarlo). Aprire http://localhost:3199 e controllare che il testo sia serif su fondo crema.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "Stile: IM Fell English e Lora self-hostati con next/font

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Helper stemma + titolo di sezione condiviso

**Files:**
- Create: `lib/stemma.ts`
- Create: `components/TitoloSezione.tsx`

- [ ] **Step 1: Creare `lib/stemma.ts`**

```ts
import fs from 'node:fs'
import path from 'node:path'

/**
 * Lo stemma è opzionale: se Gabriele non ha ancora messo public/stemma.png
 * il sito mostra solo il nome, senza errori. Controllo a ogni richiesta
 * (le pagine sono dinamiche), così basta aggiungere il file senza riavviare.
 */
export function stemmaDisponibile(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', 'stemma.png'))
}
```

- [ ] **Step 2: Creare `components/TitoloSezione.tsx`**

```tsx
/** Titolo di sezione del sito pubblico: serif verde con filetto doppio in ottone. */
export function TitoloSezione({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-titoli text-verde border-ottone mb-6 border-b-[3px] border-double pb-2 text-3xl"
    >
      {children}
    </h2>
  )
}
```

- [ ] **Step 3: Verifica TypeScript**

Run: `npx tsc --noEmit`
Expected: nessun errore.

- [ ] **Step 4: Commit**

```bash
git add lib/stemma.ts components/TitoloSezione.tsx
git commit -m "Stile: helper stemma opzionale e componente TitoloSezione

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Header (Navigazione)

**Files:**
- Modify: `components/Navigazione.tsx`

- [ ] **Step 1: Riscrivere il componente**

La logica delle voci (multipagina/one-page) resta identica; cambiano solo markup e classi:

```tsx
import Link from 'next/link'
import type { StileSito } from '@/lib/tipi'
import { stemmaDisponibile } from '@/lib/stemma'

export function Navigazione({
  nomePub,
  stile,
  mostraGalleria,
  mostraEventi,
}: {
  nomePub: string
  stile: StileSito
  mostraGalleria: boolean
  mostraEventi: boolean
}) {
  // In modalità "pagina unica" i link puntano alle sezioni della home
  // (ancore assolute: funzionano anche da /menu e /galleria, che restano
  // raggiungibili per link diretti e QR code).
  const voci =
    stile === 'onepage'
      ? [
          { href: '/#menu', testo: 'Menu' },
          ...(mostraEventi ? [{ href: '/#eventi', testo: 'Eventi' }] : []),
          ...(mostraGalleria ? [{ href: '/#galleria', testo: 'Galleria' }] : []),
          { href: '/#contatti', testo: 'Contatti' },
        ]
      : [
          { href: '/menu', testo: 'Menu' },
          ...(mostraGalleria ? [{ href: '/galleria', testo: 'Galleria' }] : []),
        ]

  return (
    <header className="bg-verde">
      <nav
        aria-label="Principale"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-3">
          {stemmaDisponibile() && <img src="/stemma.png" alt="" className="h-10 w-auto" />}
          <span className="font-titoli text-oro text-2xl">{nomePub}</span>
        </Link>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {voci.map((voce) => (
            <li key={voce.href}>
              <Link href={voce.href} className="text-crema hover:text-oro">
                {voce.testo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Verifica**

Run: `curl -s http://localhost:3199/ | grep -c 'bg-verde'`
Expected: ≥ 1. A occhio: barra verde, nome in oro serif, link crema.

- [ ] **Step 3: Commit**

```bash
git add components/Navigazione.tsx
git commit -m "Stile: header verde bottiglia con stemma e nav

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Home (hero + sezioni) e layout del sito

**Files:**
- Modify: `app/(sito)/page.tsx`
- Modify: `app/(sito)/layout.tsx` (solo `<main>` e `<footer>`)

- [ ] **Step 1: Riscrivere `app/(sito)/page.tsx`**

```tsx
import {
  getImpostazioni,
  getEventiFuturi,
  getServiziAttivi,
  getMenuPubblico,
  getGalleria,
} from '@/lib/dati'
import { stemmaDisponibile } from '@/lib/stemma'
import { SezioneEventi } from '@/components/SezioneEventi'
import { CaroselloLoghi } from '@/components/CaroselloLoghi'
import { ListaMenu } from '@/components/ListaMenu'
import { GalleriaFoto } from '@/components/GalleriaFoto'
import { TitoloSezione } from '@/components/TitoloSezione'

export default async function Home() {
  const impostazioni = getImpostazioni()
  const eventi = getEventiFuturi()
  const servizi = getServiziAttivi()
  const paginaUnica = impostazioni.stileSito === 'onepage'

  const loghi = servizi.map((servizio) => ({
    id: String(servizio.id),
    nome: servizio.nome,
    url: servizio.logo ? `/uploads/${servizio.logo}` : null,
  }))

  // In modalità "pagina unica" menu e galleria diventano sezioni della home,
  // raggiunte dalle ancore della barra di navigazione. Il footer (contatti e
  // orari) sta nel layout e fa da sezione #contatti.
  const galleria = paginaUnica ? getGalleria() : []

  return (
    <>
      <section aria-labelledby="titolo-presentazione" className="py-10 text-center">
        {stemmaDisponibile() && (
          <img src="/stemma.png" alt="" className="mx-auto mb-6 h-44 w-auto" />
        )}
        <h1 id="titolo-presentazione" className="font-titoli text-verde text-5xl">
          {impostazioni.nomePub || 'Il nostro pub'}
        </h1>
        <p className="font-titoli text-ottone mt-3 text-sm tracking-[0.3em] uppercase">
          — Birreria dal 1993 —
        </p>
        {impostazioni.descrizione && (
          <p className="mx-auto mt-6 max-w-xl text-lg">{impostazioni.descrizione}</p>
        )}
      </section>

      <SezioneEventi eventi={eventi} />

      {paginaUnica && (
        <section id="menu" aria-labelledby="titolo-menu" className="mt-12">
          <TitoloSezione id="titolo-menu">Menu</TitoloSezione>
          <ListaMenu categorie={getMenuPubblico()} />
        </section>
      )}

      {paginaUnica && galleria.length > 0 && (
        <section id="galleria" aria-labelledby="titolo-galleria" className="mt-12">
          <TitoloSezione id="titolo-galleria">Galleria</TitoloSezione>
          <GalleriaFoto foto={galleria} />
        </section>
      )}

      {loghi.length > 0 && (
        <section aria-labelledby="titolo-servizi" className="mt-12">
          <TitoloSezione id="titolo-servizi">Da noi trovi</TitoloSezione>
          <CaroselloLoghi loghi={loghi} />
        </section>
      )}
    </>
  )
}
```

Nota: la riga "Birreria dal 1993" è volutamente fissa nel codice — il sito è
del Chelsea House; se un giorno servirà renderla modificabile diventerà un
campo delle impostazioni.

- [ ] **Step 2: In `app/(sito)/layout.tsx` aggiornare `<main>` e `<footer>`**

Sostituire `<main>{children}</main>` con:

```tsx
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">{children}</main>
```

Sostituire il tag `<footer id="contatti">` e il suo contenuto con:

```tsx
      <footer id="contatti" className="bg-verde text-crema mt-auto">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div className="space-y-1">
            {impostazioni.indirizzo && <p>{impostazioni.indirizzo}</p>}
            {impostazioni.telefono && (
              <p>
                <a
                  className="hover:text-oro underline"
                  href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                >
                  {impostazioni.telefono}
                </a>
              </p>
            )}
            {impostazioni.email && (
              <p>
                <a className="hover:text-oro underline" href={`mailto:${impostazioni.email}`}>
                  {impostazioni.email}
                </a>
              </p>
            )}
          </div>
          {impostazioni.orari.length > 0 && (
            <section aria-label="Orari di apertura">
              <h2 className="font-titoli text-oro mb-2 text-xl">Orari</h2>
              <ul className="space-y-1">
                {impostazioni.orari.map((fascia, indice) => (
                  <li key={indice}>
                    {fascia.giorni}: {fascia.orario}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <ul className="space-y-1">
            {impostazioni.facebook && (
              <li>
                <a className="hover:text-oro underline" href={impostazioni.facebook}>
                  Facebook
                </a>
              </li>
            )}
            {impostazioni.instagram && (
              <li>
                <a className="hover:text-oro underline" href={impostazioni.instagram}>
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </footer>
```

E rendere il wrapper a tutta altezza: il `<>...</>` del return diventa un
`<div className="flex min-h-screen flex-col">...</div>`. Struttura finale del
return (Navigazione con le stesse props di oggi, main e footer come sopra):

```tsx
  return (
    <div className="flex min-h-screen flex-col">
      <Navigazione
        nomePub={impostazioni.nomePub || 'Il nostro pub'}
        stile={impostazioni.stileSito}
        mostraGalleria={mostraGalleria}
        mostraEventi={mostraEventi}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">{children}</main>
      <footer id="contatti" className="bg-verde text-crema mt-auto">
        {/* contenuto del footer esattamente come nel blocco sopra */}
      </footer>
      {avviso && <Popup titolo={avviso.titolo} messaggio={avviso.messaggio} />}
    </div>
  )
```

- [ ] **Step 3: Verifica**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3199/`
Expected: 200. A occhio: hero centrato serif, footer verde a 3 colonne (impilate sotto i 640px).

- [ ] **Step 4: Commit**

```bash
git add "app/(sito)/page.tsx" "app/(sito)/layout.tsx"
git commit -m "Stile: hero della home e footer a tre blocchi

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Menu con righe a puntini

**Files:**
- Modify: `components/ListaMenu.tsx`
- Modify: `app/(sito)/menu/page.tsx`

- [ ] **Step 1: Riscrivere `components/ListaMenu.tsx`**

```tsx
import type { CategoriaConVoci } from '@/lib/tipi'

export function ListaMenu({ categorie }: { categorie: CategoriaConVoci[] }) {
  const conVoci = categorie.filter((categoria) => categoria.voci.length > 0)

  if (conVoci.length === 0) {
    return <p>Il menu è in aggiornamento, torna a trovarci presto.</p>
  }

  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  return (
    <>
      {conVoci.map((categoria) => (
        <section
          key={categoria.id}
          aria-labelledby={`categoria-${categoria.id}`}
          className="mb-10"
        >
          <h2
            id={`categoria-${categoria.id}`}
            className="font-titoli text-verde border-ottone mb-4 border-b-[3px] border-double pb-1 text-2xl"
          >
            {categoria.nome}
          </h2>
          <ul className="space-y-4">
            {categoria.voci.map((voce) => (
              <li key={voce.id} className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold">{voce.nome}</h3>
                    <span
                      aria-hidden
                      className="border-ottone/40 mx-1 flex-1 border-b-2 border-dotted"
                    />
                    <p className="text-verde font-semibold whitespace-nowrap">
                      {euro.format(voce.prezzoCentesimi / 100)}
                    </p>
                  </div>
                  {voce.descrizione && (
                    <p className="text-inchiostro/70 mt-0.5 text-sm">{voce.descrizione}</p>
                  )}
                </div>
                {voce.foto && (
                  <img
                    src={`/uploads/${voce.foto}`}
                    alt={voce.nome}
                    loading="lazy"
                    className="h-24 w-24 shrink-0 rounded object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
```

- [ ] **Step 2: In `app/(sito)/menu/page.tsx` usare TitoloSezione per l'h1**

Sostituire `<h1>Menu</h1>` con:

```tsx
      <h1 className="font-titoli text-verde mt-8 mb-6 text-4xl">Menu</h1>
```

- [ ] **Step 3: Verifica**

Serve contenuto: se il database è vuoto eseguire prima `node scripts/seed-prova.mjs`.
Run: `curl -s http://localhost:3199/menu | grep -c "border-dotted"`
Expected: ≥ 1 (una riga a puntini per voce). A occhio: nome–puntini–prezzo allineati alla base.

- [ ] **Step 4: Commit**

```bash
git add components/ListaMenu.tsx "app/(sito)/menu/page.tsx"
git commit -m "Stile: menu con righe nome-puntini-prezzo da menu stampato

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Eventi a card con blocchetto data

**Files:**
- Modify: `lib/dataora.ts` (aggiunta funzione)
- Modify: `components/SezioneEventi.tsx`

- [ ] **Step 1: Aggiungere `giornoMese` in fondo a `lib/dataora.ts`**

```ts
/** "2026-06-12T21:00" → { giorno: "12", mese: "giu" } per il blocchetto data. */
export function giornoMese(naive: string): { giorno: string; mese: string } {
  const [data] = naive.split('T')
  const [anno, mese, giorno] = data.split('-').map(Number)
  const d = new Date(Date.UTC(anno, mese - 1, giorno))
  return {
    giorno: String(giorno),
    mese: new Intl.DateTimeFormat('it-IT', { month: 'short', timeZone: 'UTC' }).format(d),
  }
}
```

- [ ] **Step 2: Riscrivere `components/SezioneEventi.tsx`**

```tsx
import type { Evento } from '@/lib/tipi'
import { formattaDataOra, giornoMese } from '@/lib/dataora'
import { TitoloSezione } from '@/components/TitoloSezione'

/** Compare solo se ci sono eventi futuri: con lista vuota non renderizza nulla. */
export function SezioneEventi({ eventi }: { eventi: Evento[] }) {
  if (eventi.length === 0) return null

  return (
    <section id="eventi" aria-labelledby="titolo-eventi" className="mt-12">
      <TitoloSezione id="titolo-eventi">Prossimi eventi</TitoloSezione>
      <ul className="space-y-4">
        {eventi.map((evento) => {
          const { giorno, mese } = giornoMese(evento.dataOra)
          return (
            <li key={evento.id}>
              <article className="border-ottone/30 bg-pergamena flex gap-4 rounded border p-4">
                <div className="bg-verde text-crema flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded">
                  <span className="font-titoli text-2xl leading-none">{giorno}</span>
                  <span className="text-xs uppercase">{mese}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-titoli text-verde text-xl">{evento.titolo}</h3>
                  <p className="text-ottone text-sm">
                    <time dateTime={evento.dataOra}>{formattaDataOra(evento.dataOra)}</time>
                  </p>
                  {evento.descrizione && <p className="mt-1">{evento.descrizione}</p>}
                  {evento.immagine && (
                    <img
                      src={`/uploads/${evento.immagine}`}
                      alt=""
                      loading="lazy"
                      className="mt-3 max-h-64 rounded"
                    />
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Verifica**

Run: `curl -s http://localhost:3199/ | grep -c "bg-pergamena"`
Expected: ≥ 1 con un evento futuro nel database (seed). A occhio: card pergamena col quadrato data verde.

- [ ] **Step 4: Commit**

```bash
git add lib/dataora.ts components/SezioneEventi.tsx
git commit -m "Stile: card eventi con blocchetto data stile calendario

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Galleria, carosello e pagina galleria

**Files:**
- Modify: `components/GalleriaFoto.tsx`
- Modify: `components/CaroselloLoghi.tsx`
- Modify: `app/(sito)/galleria/page.tsx`

- [ ] **Step 1: Riscrivere `components/GalleriaFoto.tsx`**

```tsx
import type { FotoGalleria } from '@/lib/tipi'

export function GalleriaFoto({ foto }: { foto: FotoGalleria[] }) {
  if (foto.length === 0) {
    return <p>Le foto arrivano presto.</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {foto.map((f) => (
        <li key={f.id}>
          <figure>
            <img
              src={`/uploads/${f.file}`}
              alt={f.didascalia || 'Foto del locale'}
              loading="lazy"
              className="aspect-[4/3] w-full rounded object-cover"
            />
            {f.didascalia && (
              <figcaption className="text-inchiostro/70 mt-1 text-sm italic">
                {f.didascalia}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2: In `components/CaroselloLoghi.tsx` aggiornare le classi**

Nel `return`, sostituire il blocco JSX con (logica e hook identici):

```tsx
  return (
    <div className="carosello bg-crema py-4" ref={riferimento}>
      <div className="carosello-contenitore">
        {loghi.map((logo) => (
          <div className="carosello-slide" key={logo.id}>
            {logo.url ? (
              <img src={logo.url} alt={logo.nome} className="h-14 w-auto" />
            ) : (
              <span className="font-titoli text-verde text-lg">{logo.nome}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
```

(lo `style={{ height: 64 }}` inline sparisce: lo sostituisce `h-14`).

- [ ] **Step 3: In `app/(sito)/galleria/page.tsx`** sostituire `<h1>Galleria</h1>` con:

```tsx
      <h1 className="font-titoli text-verde mt-8 mb-6 text-4xl">Galleria</h1>
```

- [ ] **Step 4: Verifica**

Run: `curl -s http://localhost:3199/galleria | grep -c "aspect-\[4/3\]"`
Expected: ≥ 1 con foto nel database. A occhio: griglia 2 colonne (3 da 768px), didascalie in corsivo.

- [ ] **Step 5: Commit**

```bash
git add components/GalleriaFoto.tsx components/CaroselloLoghi.tsx "app/(sito)/galleria/page.tsx"
git commit -m "Stile: griglia galleria e carosello loghi

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Pop-up e pannello admin

**Files:**
- Modify: `components/Popup.tsx` (solo classi)
- Modify: `app/admin/(pannello)/layout.tsx`
- Modify: `app/admin/login/page.tsx`

- [ ] **Step 1: In `components/Popup.tsx`** il `<dialog>` è già stilato da
  `globals.css` (Task 1); aggiungere solo le classi ai contenuti, sostituendo
  il blocco `return` con:

```tsx
  return (
    <dialog ref={dialogo} onClose={ricordaChiusura} aria-labelledby="popup-titolo">
      <h2 id="popup-titolo" className="font-titoli text-verde text-2xl">
        {titolo}
      </h2>
      {messaggio && <p className="mt-3">{messaggio}</p>}
      <form method="dialog" className="mt-5 text-right">
        <button className="bg-verde text-crema cursor-pointer rounded px-4 py-2">Chiudi</button>
      </form>
    </dialog>
  )
```

- [ ] **Step 2: In `app/admin/(pannello)/layout.tsx`** sostituire il `return` con:

```tsx
  return (
    <div className="admin mx-auto max-w-3xl px-4 pb-12">
      <header className="bg-verde -mx-4 mb-4 px-4 py-3">
        <nav aria-label="Pannello" className="flex flex-wrap items-center justify-between gap-2">
          <ul className="text-crema flex list-none flex-wrap gap-x-4 gap-y-1 p-0!">
            <li>
              <Link className="hover:text-oro" href="/admin">
                Pannello
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/menu">
                Menu
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/eventi">
                Eventi
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/galleria">
                Galleria
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/servizi">
                Servizi
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/popup">
                Pop-up
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/admin/impostazioni">
                Impostazioni
              </Link>
            </li>
            <li>
              <Link className="hover:text-oro" href="/" target="_blank">
                Vedi il sito
              </Link>
            </li>
          </ul>
          <form action={esci}>
            {/* Tailwind v4: l'important è col punto esclamativo FINALE */}
            <button className="mt-0! bg-transparent! text-oro! underline">Esci</button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
```

- [ ] **Step 3: In `app/admin/login/page.tsx`** sostituire il tag `<main>` con
  `<main className="admin mx-auto max-w-sm px-4 py-16">` (resto invariato).

- [ ] **Step 4: Verifica**

```bash
curl -s http://localhost:3199/admin/login | grep -c 'class="admin'
```

Expected: 1. A occhio (con login): nav del pannello su barra verde, form
incolonnati, bottoni di conferma eliminazione rossi.

- [ ] **Step 5: Commit**

```bash
git add components/Popup.tsx "app/admin/(pannello)/layout.tsx" app/admin/login/page.tsx
git commit -m "Stile: pop-up pergamena e pannello admin minimo

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Seed demo "Chelsea House"

**Files:**
- Create: `scripts/seed-demo.mjs` (il vecchio `seed-prova.mjs` resta)

- [ ] **Step 1: Creare `scripts/seed-demo.mjs`**

```js
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
   facebook=?, instagram=?, orari=? WHERE id=1`
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

// --- servizi (loghi segnaposto: quelli veri li carichi dal pannello) ---

const servizio = db.prepare('INSERT INTO servizi (nome, logo, ordine, attivo) VALUES (?, ?, ?, 1)')
servizio.run('Sky', await logoSegnaposto('demo-logo-sky.webp', 'SKY', '#1b2a6b'), 0)
servizio.run('DAZN', await logoSegnaposto('demo-logo-dazn.webp', 'DAZN', '#0a0a0a'), 1)
servizio.run('Serie A', await logoSegnaposto('demo-logo-seriea.webp', 'SERIE A', '#0b6e4f'), 2)

// --- galleria (foto segnaposto in toni caldi: da sostituire con foto vere) ---

const foto = db.prepare('INSERT INTO foto_galleria (file, didascalia, ordine) VALUES (?, ?, ?)')
foto.run(await fotoSegnaposto('demo-foto-bancone.webp', 'Il bancone', '#6b4a2b'), 'Il bancone', 0)
foto.run(await fotoSegnaposto('demo-foto-sala.webp', 'La sala', '#7a5a35'), 'La sala grande', 1)
foto.run(await fotoSegnaposto('demo-foto-spine.webp', 'Le spine', '#52381f'), 'Le nostre spine', 2)
foto.run(await fotoSegnaposto('demo-foto-giardino.webp', 'Il giardino', '#4a5a2b'), 'Il giardino', 3)
foto.run(await fotoSegnaposto('demo-foto-vetrina.webp', 'La vetrina', '#8a6d1f'), 'La vetrina sulla via', 4)

console.log('Demo Chelsea House pronta: npm run dev e buona visione.')
```

- [ ] **Step 2: Provarlo su database pulito**

```bash
cd "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site"
rm -rf data && npm run dev -- --port 3199 &
sleep 5 && curl -s -o /dev/null http://localhost:3199/   # prima richiesta: crea lo schema
node scripts/seed-demo.mjs
curl -s http://localhost:3199/ | grep -o "Chelsea House" | head -1
curl -s http://localhost:3199/menu | grep -c "Guinness"
```

Expected: `Chelsea House` e `1` (o più). A occhio: menu pieno, 2 eventi, carosello con 3 loghi, galleria con 5 foto.

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-demo.mjs
git commit -m "Seed demo Chelsea House con immagini segnaposto generate

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Verifica finale (criteri di accettazione della spec)

**Files:** nessuna modifica prevista (solo fix se emergono problemi).

- [ ] **Step 1: Build e lint**

```bash
cd "/Users/gabrieledimodica/Documents/cartella senza nome/pub-site"
npm run build 2>&1 | tail -5 && npm run lint 2>&1 | tail -3
```

Expected: build verde; lint con 0 errori (warning `no-img-element` noti e accettati).

- [ ] **Step 2: Entrambe le strutture**

```bash
node -e "const D=require('better-sqlite3'); new D('data/pub.db').prepare(\"UPDATE impostazioni SET stile_sito='onepage' WHERE id=1\").run()"
curl -s http://localhost:3199/ | grep -c 'href="/#menu"'   # atteso ≥1
node -e "const D=require('better-sqlite3'); new D('data/pub.db').prepare(\"UPDATE impostazioni SET stile_sito='multipagina' WHERE id=1\").run()"
curl -s http://localhost:3199/ | grep -c 'href="/menu"'    # atteso ≥1
```

- [ ] **Step 3: Controllo visivo (manuale)**

Aprire http://localhost:3199 nel browser: finestra stretta ~375px e larga ~1280px.
Controllare: niente scroll orizzontale, nav usabile, righe menu allineate,
footer impilato su mobile. Ripetere in modalità one-page (cambiando dalle
Impostazioni del pannello, con login `admin-di-prova`).

- [ ] **Step 4: Pop-up dal vivo**

Dal pannello `/admin/popup`: togliere le date, accendere "Attivo", salvare.
Aprire il sito: dialog pergamena col bordo ottone; chiudere; navigare: non
riappare. Rispegnerlo.

- [ ] **Step 5: Flusso admin via curl (regressione)**

```bash
ACTION=$(curl -s http://localhost:3199/admin/login | grep -oE '\$ACTION_ID_[a-f0-9]+' | head -1)
curl -s -c /tmp/ck.txt -o /dev/null -X POST http://localhost:3199/admin/login -F "$ACTION=" -F "password=admin-di-prova"
curl -s -b /tmp/ck.txt -o /dev/null -w "admin: %{http_code}\n" http://localhost:3199/admin
```

Expected: `admin: 200`. (Attenzione: per testare i form via curl prendere
l'ACTION_ID del form giusto, non il primo della pagina — il primo è "Esci".)

- [ ] **Step 6: Senza stemma**

`public/stemma.png` non esiste ancora: verificare che home e header mostrino
solo il nome senza errori (già il caso di default). Quando Gabriele aggiunge
il file, ricaricare e verificare che compaia in header (h-10) e hero (h-44).

- [ ] **Step 7: Commit finale (eventuali fix) e pulizia**

```bash
git add -A && git diff --cached --quiet || git commit -m "Fix dalla verifica finale della vestizione demo

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
pkill -f "next dev" 2>/dev/null || true
```

---

## Fuori perimetro (non fare)

Hosting/deploy, lightbox, animazioni, font gotici, SEO/JSON-LD, allergeni,
modifica rapida prezzi, riordino drag&drop. Vedi spec.
