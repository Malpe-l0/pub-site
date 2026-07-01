---
name: Chelsea House
description: British pub di Imola dal 1993 — direzione visiva "Black Friar": verde British drenched, accento oro/ottone, tipografia serif Cinzel + EB Garamond, sezioni "carta" su texture a grana. Il pannello /admin conserva la palette araldica su carta.
colors:
  verde: "#1e6240"
  verde-2: "#1e6240"
  verde-footer: "#2e3732"
  verde-inchiostro: "#243a2d"
  panna: "#f4eedd"
  panna-2: "#d8ccb4"
  panna-3: "#d8ccb4"
  panna-4: "#a99f8c"
  carta: "#f4eedd"
  oro: "#eab325"
  oro-hover: "#f4c54a"
  oro-ink: "#f2cb5c"
  oro-scuro: "#7e5b1f"
typography:
  display:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "clamp(2.6rem, 7vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.04
  headline:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "clamp(2.2rem, 5.6vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.05
  eyebrow:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "0.74rem"
    fontWeight: 400
    letterSpacing: "0.4em"
    textTransform: "uppercase"
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  none: "0"
spacing:
  sezione-y: "clamp(64px, 9vw, 120px)"
  container-x: "clamp(24px, 5vw, 52px)"
  container: "1180px"
components:
  bottone-primario:
    backgroundColor: "{colors.oro}"
    textColor: "{colors.verde-inchiostro}"
    border: "1px solid {colors.oro}"
    padding: "15px 30px"
  bottone-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.panna}"
    border: "1px solid {colors.panna}"
  nav:
    behavior: "fixed; trasparente sull'hero, verde solido + blur dopo lo scroll"
  carta-menu:
    behavior: "schede per categoria (dal DB) + righe con filetto di puntini e prezzo oro"
  muro-birre:
    backgroundColor: "{colors.carta}"
    behavior: "griglia 3 col su carta, loghi centrati, nessun bordo-muro"
---

# Design System: Chelsea House — "Black Friar"

## 1. Overview

**Creative North Star: "Un angolo d'Inghilterra a Imola."**

Il sito pubblico è il verde British del pub: il verde profondo della sala, la
crema dei bicchieri, l'oro/ottone dell'insegna. Lo sfondo è un verde racing
drenched (`#1e6240`); il testo è crema; l'accento è un oro caldo. Le sezioni
"carta" (birre, galleria) ribaltano la logica: fondo crema su texture a grana,
inchiostro verde scuro. La tipografia è **serif** — Cinzel a capitali romane per
i titoli (insegna scolpita), EB Garamond per il testo.

Il sistema discende da un **handoff hi-fi** ("Black Friar", giugno 2026) e
rimpiazza la precedente direzione "Taproom" (espresso/ambra, Oswald). La palette
araldica su carta del vecchio "menu stampato del 1993" **sopravvive solo nel
pannello /admin**, che non è toccato.

**Key Characteristics:**
- Verde British drenched: lo sfondo è verde, non espresso né carta. La pagina è il pub.
- Un solo accento: l'oro/ottone dell'insegna. Il calore in più lo portano le foto.
- Serif scolpito: Cinzel (capitali) per i titoli, EB Garamond per il corpo.
- Doppio registro di superficie: verde per le sezioni "sala", crema-a-grana per le sezioni "documento" (birre, galleria).
- Squadrato di default: niente pill, niente bordi arrotondati.
- Image-led: hero e galleria poggiano sulle foto del locale.
- Mobile-first: si legge bene su un telefono, la sera.

## 2. Colors

Palette "Black Friar": il verde della sala, la crema dei bicchieri, l'oro
dell'insegna.

### Verdi (sfondo)
- **Verde** (#1e6240): sfondo pagina, hero (overlay), statement band, sezione menu.
- **Verde footer** (#2e3732): footer.
- **Verde inchiostro** (#243a2d): testo sui pulsanti oro; nomi birre su carta.

### Crema (testo + carta)
- **Panna** (#f4eedd): testo principale su verde; superficie "carta" delle sezioni birre/galleria.
- **Panna 2** (#d8ccb4): riga di servizio dell'hero. (4.59:1 su verde — AA.)
- **Panna 3** (#d8ccb4): paragrafi secondari su verde.
- **Panna 4** (#a99f8c): note brevi/footnote su verde.

### Oro (accento)
- **Oro** (#eab325): accento pieno — pulsante primario, tab attiva, bordo superiore del footer, pulsante Maps.
- **Oro hover** (#f4c54a): hover dei pulsanti.
- **Oro-ink** (#f2cb5c): oro **come testo sul verde** — eyebrow, titoli del footer, prezzi del menu. (4.68:1 su verde — AA.)
- **Oro-scuro** (#7e5b1f): oro **come testo sulla carta** — eyebrow "La selezione", etichette stile birra. (5.32:1 su crema — AA verificato; il gold chiaro del mock #a8820f si fermava a 3.09:1.)

### Named Rules
**La Regola dell'Unico Accento.** C'è una sola tinta accesa, l'oro. Niente
seconda tinta che compete: il colore in più lo portano le foto.
**La Regola del Doppio Registro.** Verde = "la sala" (hero, statement, menu);
crema-a-grana = "il documento" (birre, galleria). L'oro cambia tono col fondo:
chiaro (oro-ink) sul verde, scuro (oro-scuro) sulla carta.

> Niente tema chiaro automatico: Black Friar è **una palette fissa**. Verde e
> carta si alternano già nel design; non serve invertire col `prefers-color-scheme`.

## 3. Typography

**Display / titoli:** Cinzel (400–700) — capitali romane serif, fanno da insegna
scolpita. Non servono maiuscole forzate: il font è già a capitali.
**Testo corrente:** EB Garamond (400 + italic + 500/600) — paragrafi, eyebrow,
note, pulsanti. Self-hostati con next/font.

> Nota tecnica: i font sono esposti come variabili `--font-oswald` (Cinzel) e
> `--font-mulish` (EB Garamond) per non rinominare le utility `font-titoli` /
> `font-testo` già diffuse nel codice.

### Hierarchy
- **Display H1** (Cinzel 600, clamp(2.6→6rem), lh 1.04, text-balance): nome del pub nell'hero, centrato.
- **Headline H2** (Cinzel 600, clamp(2.2→4.6rem), lh 1.02–1.05): titoli di sezione.
- **Eyebrow** (EB Garamond 400, 0.74rem, tracking 0.4em, MAIUSCOLO): oro-ink sul verde, oro-scuro sulla carta.
- **Body** (EB Garamond 400, 0.98–1.06rem, lh 1.85): paragrafi, max ~65–75ch.
- **Nota / prezzo** (EB Garamond, 0.82–0.86rem; italic per le note): prezzi in oro-ink.

### Named Rules
**La Regola dell'Insegna Scolpita.** Titoli in Cinzel: capitali serif, come
incise su una targa d'ottone.
**La Regola dell'Eyebrow Misurato.** L'eyebrow apre alcune sezioni, non tutte:
è un gesto, non un timbro su ogni blocco. (Hero + Birre + Menu; lo statement
band ne fa a meno.)

## 4. Elevation & Bordi

Sistema piatto: la profondità nasce dal **cambio di superficie** (verde ↔
carta-a-grana) e dai **bordi hairline** (`1px solid rgb(... / .16–.35)`). Le
sezioni "carta" usano `background-image: url(grain.png)` per la texture.
Border-radius: tutto **squadrato (0)**. Bordo superiore del footer in oro; nav
solida con bordo inferiore hairline oro dopo lo scroll.

## 5. Components

### Nav (sticky)
`position: fixed`. Sull'hero è trasparente (gradiente nero→trasparente); dopo
~80px di scroll diventa **verde solido + backdrop-blur** con bordo inferiore oro
e padding ridotto. Wordmark = **stemma (crest) + "Chelsea House"** (Cinzel). Link
in MAIUSCOLO EB Garamond (hover oro). Sotto 860px diventa hamburger con pannello
a tendina. Componente client `NavTaproom`.

### Pulsanti
Filetto sottile, EB Garamond MAIUSCOLO tracking 0.2em, padding 15×30px.
- **Primario:** fondo oro, testo verde-inchiostro, hover oro chiaro.
- **Ghost:** trasparente, testo+bordo crema, hover fondo crema/testo verde.
Classi `.btn-targhetta` + `-primario|-ghost` in `globals.css`.

### Hero
Full-width (`clamp(560px,82vh,860px)`), foto `foto-sala` con overlay scuro,
contenuto **centrato**: eyebrow + H1 (nome dal DB) + **riga di servizio**
(indirizzo + orari dal pannello) + due CTA ("Vedi il menu", "Dove siamo"). La
fold risponde subito a "che orari fa?".

### Statement band
Verde. Divisore con "30+ anni a Imola" (Cinzel) tra due filetti oro, poi griglia
2 col: H2 "Un angolo d'Inghilterra a Imola" + paragrafo (`descrizione` dal DB) +
CTA + foto `foto-pinta`.

### Muro birre (signature)
Sezione **carta-a-grana**. Griglia 3 col (2 sotto 640px), celle trasparenti
(niente bordi-muro): logo centrato + nome (Cinzel) + stile (oro-scuro). Selezione
**statica** nel codice (`MuroBirre`); loghi PNG puliti in `public/taproom/`.

### Carta menu (signature)
Sezione verde. **Schede per categoria** generate dal **DB** (`getMenuPubblico`):
tab attiva in oro, le altre con bordo crema. Sotto, griglia 2 col di righe — nome
(Cinzel) + nota italica (`descrizione`) + filetto di puntini + prezzo (oro-ink).
Componente client `CartaMenu`. Vuoto → messaggio "menu in aggiornamento".

### Galleria
Sezione carta-a-grana: 3 foto in griglia (1 col su mobile) dal **DB**
(`getGalleriaPubblica`: Instagram o caricate a mano), con fallback alle foto del
bundle.

### Footer
Verde footer. Centrato: **stemma (crest)** + tagline "Fermati. Accomodati.
Resta." (Cinzel). Sotto, griglia 1.4fr/1fr: nome + indirizzo + orari + pulsante
oro "Indicazioni su Maps" (link calcolato su nome+indirizzo) | "Contatti"
(tel/Instagram/Facebook/email dal DB). Riga finale "© Chelsea House · British
Pub · Imola". Vive in `app/(sito)/layout.tsx`.

## 6. Do's and Don'ts

### Do:
- **Do** tenere l'oro come unico accento; cambiare il suo tono col fondo (oro-ink su verde, oro-scuro su carta).
- **Do** Cinzel per i titoli, EB Garamond per tutto il resto.
- **Do** alternare i due registri di superficie (verde / carta-a-grana) per dare ritmo.
- **Do** poggiare hero e galleria su foto vere del locale.
- **Do** progettare per contenuti veri e imperfetti dal pannello (foto storte, descrizioni assenti, menu vuoto, orari mancanti) — i fallback ci sono.
- **Do** tenere il corpo testo ≥16px e i contrasti ≥4.5:1 (clientela non giovane, WCAG AA).

### Don't:
- **Don't** reintrodurre un tema chiaro automatico: Black Friar è una palette fissa.
- **Don't** introdurre una seconda tinta accesa accanto all'oro.
- **Don't** usare il gold chiaro (#eab325) come **testo piccolo su carta**: non passa AA (usa oro-scuro #7e5b1f).
- **Don't** arrotondare: niente pill, tutto squadrato.
- **Don't** aggiungere font: Cinzel + EB Garamond sono il sistema del sito pubblico.
- **Don't** mettere l'eyebrow su ogni sezione: è un gesto misurato, non una grammatica.
- **Don't** toccare il pannello /admin con questa direzione: lì resta la palette araldica su carta.
