---
name: Chelsea House
description: Birreria inglese di Catania dal 1993 — direzione visiva "Taproom": sala scura espresso, accento ambra/ottone, tipografia condensata Oswald + Mulish. Il pannello /admin conserva la palette araldica su carta.
colors:
  espresso: "#15120e"
  espresso-2: "#1c1813"
  espresso-3: "#0d0b08"
  nero-caldo: "#1a140c"
  panna: "#f1e7d3"
  panna-2: "#d7cab0"
  panna-3: "#cdbfa4"
  panna-4: "#8d7f66"
  panna-muro: "#efe6d3"
  ambra: "#e2a23a"
  ambra-hover: "#f0b54f"
  ambra-scura: "#7e5b1f"
typography:
  display:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(3.6rem, 11.5vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.015em"
    textTransform: "uppercase"
  headline:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 0.95
    textTransform: "uppercase"
  eyebrow:
    fontFamily: "Oswald, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    letterSpacing: "0.32em"
    textTransform: "uppercase"
  body:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  none: "0"
  tile: "4px"
spacing:
  sezione-y: "clamp(64px, 9vw, 118px)"
  container-x: "clamp(24px, 5vw, 40px)"
  container: "1200px"
components:
  bottone-targhetta-primario:
    backgroundColor: "{colors.ambra}"
    textColor: "{colors.nero-caldo}"
    border: "doppio filetto via inset box-shadow"
    padding: "17px 40px"
  bottone-targhetta-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.panna}"
    border: "doppio filetto ambra via inset box-shadow"
  muro-birre:
    backgroundColor: "{colors.panna-muro}"
    divisori: "1px solid #ddccaa"
  tile-sport:
    backgroundColor: "{colors.panna}"
    rounded: "{rounded.tile}"
    height: "110px"
---

# Design System: Chelsea House — "Taproom"

## 1. Overview

**Creative North Star: "La sala la sera, vista dalla porta che si apre."**

Il sito pubblico è la birreria al buio della sera: legno scuro, mattoni, i
bicchieri appesi, e l'ambra della birra come unica luce accesa. Lo sfondo è
espresso quasi nero, il testo è crema, l'accento è l'ottone/ambra del bancone.
La tipografia condensata in maiuscolo (Oswald) fa da insegna; Mulish tiene il
testo corrente leggibile.

Il sistema discende da un **handoff hi-fi** (direzione "Taproom", giugno 2026)
e rimpiazza il precedente "menu stampato del 1993". Quel sistema su carta
(verdi araldici, IM Fell English) **sopravvive solo nel pannello /admin**, che
non è toccato da questa direzione.

**Key Characteristics:**
- Sala scura drenched: lo sfondo è espresso, non carta. La pagina è il locale.
- Un solo accento acceso: l'ambra/ottone della birra. Tutto il resto è
  espresso e crema.
- Insegna prima che interfaccia: maiuscole condensate, filetti, ◆, doppi bordi.
- Squadrato di default: niente pill arrotondate (solo le tile foto/loghi: 4px).
- Image-led: hero, menu, sport e galleria poggiano sulle foto del locale.
- Mobile-first: si legge bene su un telefono, la sera, con una birra in mano.

## 2. Colors

Palette "taproom": il buio della sala, la crema dei bicchieri, l'ambra della
spina.

### Sfondi (espresso)
- **Espresso** (#15120e): sfondo della pagina e testo su ambra.
- **Espresso 2** (#1c1813): sezioni alternate (menu) e card delle serate.
- **Espresso 3** (#0d0b08): footer e pannello "Trasmettiamo con".
- **Nero caldo** (#1a140c): testo e bordi sui pulsanti ambra.

### Testo (crema)
- **Panna** (#f1e7d3): testo principale su scuro.
- **Panna 2** (#d7cab0): sottotitolo dell'hero.
- **Panna 3** (#cdbfa4): paragrafi secondari, link del footer.
- **Panna 4** (#8d7f66): note e footnote.
- **Panna muro** (#efe6d3): unica grande superficie chiara — il pannello del
  muro birre. Le tile sport usano la panna piena (#f1e7d3).

### Accento (ambra)
- **Ambra** (#e2a23a): l'accento unico — eyebrow, titoli del footer, CTA,
  marquee, tag delle serate, bordi hairline. Su espresso ha contrasto pieno.
- **Ambra hover** (#f0b54f): hover dei pulsanti primari.
- **Ambra scura** (#7e5b1f): etichette "stile birra" sul muro crema (4.97:1 su
  panna-muro — WCAG AA verificato per il testo piccolo; ribassata dal #8f6d24
  del mock, che si fermava a 3.86:1).

### Named Rules
**La Regola dell'Unico Acceso.** C'è una sola tinta accesa, l'ambra. Niente
seconda tinta che le compete: il calore lo portano le foto, non un secondo
colore.
**La Regola del Muro.** Le superfici chiare (crema) sono l'eccezione che
incornicia i marchi (muro birre, tile sport), non il fondo della pagina. La
pagina resta espresso — salvo quando il dispositivo chiede il tema chiaro (sotto).

### Tema chiaro automatico — "il pub di giorno"
Il sito segue la preferenza del dispositivo (`prefers-color-scheme`). Lo scuro
resta l'identità e il default; quando il dispositivo è in chiaro le superfici
piatte virano sulla **crema del brand** (la palette panna, non una pergamena da
startup) con inchiostro espresso e ambra scurita sui testi.

Meccanismo: i token primitivi (espresso/panna) vengono ridefiniti dentro
`@media (prefers-color-scheme: light)` sullo `.sito-taproom` — niente JS, niente
flash, SSR-safe. Le **isole notturne** (`.isola-notte`: hero, nav, marquee,
sport, footer) ripinnano i valori notte e restano scure in ogni tema: sono i
momenti foto/ambra. L'ambra-testo passa per il token `--color-ambra-ink` (ambra
piena su scuro, `#745419` su crema, 5.0:1 WCAG AA); l'ambra di sfondo (pulsanti,
marquee, tag-data) resta piena, con testo `nerocaldo`. Il pannello /admin non è
toccato.

## 3. Typography

**Display / UI:** Oswald (300–700) — titoli, eyebrow, nav, pulsanti, chips,
tag. Sempre MAIUSCOLO. Condensata: fa da insegna.
**Testo corrente:** Mulish (400 + italic) — paragrafi e note. Self-hostati con
next/font, nessuna richiesta esterna.

### Hierarchy
- **Display H1** (Oswald 700, clamp(3.6→9.5rem), lh 0.9, tracking -0.015em):
  solo il nome del pub nell'hero.
- **Headline H2** (Oswald 600, clamp(2.2→3.6rem), lh 0.95): titoli di sezione.
- **Eyebrow** (Oswald 500, 0.8rem, tracking 0.32em, MAIUSCOLO, ambra): la
  riga che apre ogni sezione. Variante "insegna" con filetto + ◆ nell'hero e
  nello sport.
- **Body** (Mulish 400, 1.0–1.14rem, lh 1.6–1.7): paragrafi, max ~65–75ch.
- **Tag / label** (Oswald 600, 0.74–0.82rem, tracking 0.1–0.16em): chips,
  tag delle serate, etichette stile birra.

### Named Rules
**La Regola dell'Insegna.** Titoli, eyebrow e UI sono MAIUSCOLO condensato:
se una composizione non potrebbe stare su un'insegna dipinta, ripensala.
**La Regola dei Filetti.** L'eyebrow "a insegna" (filetto 1px ambra + ◆ +
testo) è la firma di hero e sport. Non diventa decorazione su ogni sezione.

## 4. Elevation & Bordi

Sistema quasi piatto: la profondità nasce dai **cambi di espresso** (15→1c→0d)
e dai **bordi hairline ambra** (`1px solid rgb(226 162 58 / .15–.4)`).
L'unica ombra ammessa è quella del **muro birre** (`0 24px 60px rgb(0 0 0 /
.4)`), che stacca il pannello crema dal fondo scuro — è un oggetto fisico
appoggiato, non una card.

Accenti a banda: bordi `3px solid` su marquee (espresso) e bordo superiore del
footer (ambra). Border-radius: tutto **squadrato (0)**; solo le tile foto/loghi
usano `4px`.

## 5. Components

### Pulsanti — "targhetta a doppio filetto"
La firma del look. Doppia cornice via `border` + due `inset box-shadow`.
- **Primario:** fondo ambra, testo nero caldo, hover ambra chiara.
- **Ghost:** trasparente, testo crema, cornice ambra, hover ambra al 12%.
- Oswald 600, MAIUSCOLO, tracking 0.13em, padding 17×40px. Classi
  `.btn-targhetta` + `.btn-targhetta-primario|ghost` in `globals.css`.

### Nav
Barra trasparente sovrapposta all'hero (`position:absolute`). Wordmark testuale
"Chelsea House" (Oswald 700) + link in MAIUSCOLO (hover ambra). Sotto 860px
diventa **hamburger** con pannello a tendina scuro (componente client
`NavTaproom`).

### Marquee (signature)
Striscia ambra a tutta larghezza, testo espresso, bordi 3px espresso. Due copie
della lista che scorrono `translateX(0 → -50%)` in 28s linear, loop senza
stacchi. **Rispetta `prefers-reduced-motion`** (si ferma). È l'unico movimento
ambientale del sito.

### Muro birre (signature)
Un solo pannello **crema** con i marchi in griglia 3 colonne (2 sotto 860px),
divisi da linee `1px #ddccaa` per l'effetto "muro continuo". Logo + nome
(Oswald 600) + stile (Oswald 700, ambra scura). Selezione **statica** nel
codice (`MuroBirre`): i loghi ruotano cambiando l'asset, non dal DB.

### Sport — "Trasmettiamo con"
Pannello espresso con tile **crema** (110px, 4px) che ospitano i loghi dei
servizi TV. I loghi arrivano dal **DB servizi** del pannello (Sky, DAZN, Serie
A…). A sinistra le chips delle competizioni (statiche).

### Serate
Card espresso-2 con bordo ambra (hover più acceso): tag data in ambra +
titolo (Oswald) + nota. Alimentate dagli **eventi futuri del DB**; la sezione
sparisce se non ci sono eventi.

### La riga del menu
Nome (Oswald) — filetto di puntini — prezzo (ambra), descrizione sotto in panna
3. Sulla home il menu è introdotto da chips delle **categorie reali** + CTA
verso `/menu`, dove vive la lista completa coi prezzi.

## 6. Do's and Don'ts

### Do:
- **Do** tenere l'ambra come unico accento acceso; il calore in più lo portano
  le foto.
- **Do** MAIUSCOLO condensato (Oswald) per titoli, eyebrow e UI; Mulish per il
  corpo.
- **Do** poggiare hero/menu/sport/galleria su foto vere del locale.
- **Do** rispettare `prefers-reduced-motion` (marquee, scroll, bollicine) e
  tenere il corpo testo ≥16px (clientela non giovane, WCAG AA).
- **Do** progettare per contenuti veri e imperfetti dal pannello (foto storte,
  descrizioni assenti, zero eventi, loghi mancanti).

### Don't:
- **Don't** fare del tema chiaro una "carta chiara da startup": è "il pub di
  giorno" sulla crema del brand, attivato solo dal dispositivo. Lo scuro resta
  default e identità; la palette araldica resta solo in /admin.
- **Don't** introdurre una seconda tinta accesa accanto all'ambra.
- **Don't** arrotondare: niente pill, solo 4px sulle tile foto/loghi.
- **Don't** mettere testo crema chiaro (panna 4) come corpo lungo su espresso:
  va bene per note brevi, non per paragrafi.
- **Don't** aggiungere font: Oswald + Mulish sono il sistema del sito pubblico.
- **Don't** trasformare l'eyebrow "a insegna" in una grammatica ripetuta su
  ogni blocco: è un gesto, non un timbro.
