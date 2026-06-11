---
name: Chelsea House
description: Sito vetrina di una birreria del 1993 in stile pub inglese — tipografia da menu stampato, palette dallo stemma araldico.
colors:
  verde-bottiglia: "#1f3d2b"
  ottone-del-bancone: "#8a6d1f"
  oro-della-spina: "#d4b14a"
  carta-del-menu: "#f5f1e8"
  sottobicchiere: "#fffdf7"
  stout: "#2b2418"
  mattone: "#8c2f1b"
typography:
  display:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    letterSpacing: "0.3em"
rounded:
  sm: "4px"
  md: "6px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  sezione: "48px"
components:
  bottone-primario:
    backgroundColor: "{colors.verde-bottiglia}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "7px 16px"
  bottone-pericolo:
    backgroundColor: "{colors.mattone}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "7px 16px"
  card-evento:
    backgroundColor: "{colors.sottobicchiere}"
    rounded: "{rounded.sm}"
    padding: "16px"
  targhetta-servizio:
    backgroundColor: "{colors.sottobicchiere}"
    rounded: "{rounded.sm}"
    height: "96px"
    width: "176px"
---

# Design System: Chelsea House

## 1. Overview

**Creative North Star: "Il menu stampato del 1993"**

Ogni superficie del sito è una pagina del menu stampato del Chelsea House:
carta calda, inchiostro scuro, filetti doppi, righe di puntini tra piatto e
prezzo. Il verde bottiglia dell'insegna incornicia la pagina (header e footer);
in mezzo c'è carta. La tipografia fa il lavoro che altrove fanno effetti e
animazioni: IM Fell English — digitalizzato da caratteri inglesi del Seicento,
con le sue irregolarità di stampa — dà l'età, Lora tiene la leggibilità.

Il sistema rifiuta esplicitamente tutto ciò che PRODUCT.md elenca come
anti-referenza: landing SaaS, gradienti, glassmorphism, marquee animati
("estetica troppo moderna", parola del committente), minimalismo freddo da
startup. Il test è sempre lo stesso: **se non potrebbe stare su un menu
stampato o un'insegna di legno, non appartiene al Chelsea.**

**Key Characteristics:**
- Carta incorniciata di verde: il colore pieno sta ai bordi, il contenuto sta su carta.
- Tipografia d'epoca al posto degli effetti: il carattere lo fanno i font, non il CSS.
- Piatto come la stampa: zero ombre, gerarchia da filetti e colore.
- Statico e solido: il movimento è l'eccezione motivata (un dialog che appare), mai il default.
- Mobile-first: si legge bene su un telefono, la sera, con una birra in mano.

## 2. Colors: la palette dello stemma

Palette estratta dallo stemma araldico del pub: verdi e ori su carta.

### Primary
- **Verde Bottiglia** (#1f3d2b): il colore dell'insegna. Header, footer,
  blocchetto data degli eventi, bottoni del pannello, titoli su carta. È la
  cornice del sito, non il riempimento.

### Secondary
- **Ottone del Bancone** (#8a6d1f): filetti doppi sotto i titoli, righe di
  puntini del menu, bordi delle targhette, la riga "BIRRERIA DAL 1993". È il
  metallo del pub: rifinisce, non riempie.
- **Oro della Spina** (#d4b14a): accenti SOLO su fondo verde (nome del pub
  nell'header, titoli del footer, hover dei link su scuro). Mai su carta: sul
  chiaro non ha contrasto sufficiente.

### Tertiary
- **Mattone** (#8c2f1b): esclusivamente azioni distruttive nel pannello admin
  (conferme di eliminazione). Mai sul sito pubblico.

### Neutral
- **Carta del Menu** (#f5f1e8): sfondo delle pagine pubbliche.
- **Sottobicchiere** (#fffdf7): superfici appoggiate sulla carta — card
  eventi, targhette servizi, pannello del pop-up.
- **Stout** (#2b2418): tutto il testo su carta. Al 70% di opacità per
  descrizioni e didascalie, mai più chiaro di così.

### Named Rules
**La Regola dell'Insegna.** Il Verde Bottiglia incornicia (header, footer,
dettagli), non riempie: le pagine restano carta. Una pagina a fondo verde è
un errore.
**La Regola dell'Oro.** Oro della Spina solo su Verde Bottiglia. Su carta si
usa Ottone del Bancone. Nessuna eccezione: è una regola di contrasto, non di
gusto.

## 3. Typography

**Display Font:** IM Fell English (fallback Georgia, serif)
**Body Font:** Lora (fallback Georgia, serif)

**Character:** un torchio inglese del Seicento che stampa il menu di stasera:
i titoli portano l'età e la solennità, il corpo resta limpido e leggibile.
Entrambi self-hostati con next/font — nessuna richiesta esterna.

### Hierarchy
- **Display** (400, 3rem, lh 1.1): solo il nome del pub nell'hero. Uno per pagina.
- **Headline** (400, 1.875rem, lh 1.2): titoli di sezione, sempre con filetto
  doppio in Ottone del Bancone (`border-bottom: 3px double`). Categorie del
  menu a 1.5rem con lo stesso filetto.
- **Title** (400, 1.25rem, lh 1.3): titoli delle card evento, nome del pub nell'header.
- **Body** (400, 1rem, lh 1.5, Lora): tutto il testo. Righe mai oltre i ~70ch
  (il contenitore è max-w-5xl con colonne di testo più strette).
- **Label** (400, 0.875rem, tracking 0.3em, MAIUSCOLO): la tagline "— BIRRERIA
  DAL 1993 —". È l'unico maiuscoletto spaziato del sito: ripeterlo come
  grammatica di sezione è vietato.

### Named Rules
**La Regola del Menu Stampato.** Se una composizione tipografica non potrebbe
uscire da un torchio (gradiente nel testo, outline, glow, font variabile che
si anima), è proibita.
**La Regola dei Puntini.** Nome–puntini–prezzo (`border-bottom: 2px dotted`)
è LA firma del menu: non si sostituisce con tabelle, card o badge.

## 4. Elevation

Il sistema è **piatto come la stampa**: la carta non proietta ombre. Nessun
`box-shadow` in tutto il sito pubblico. La profondità si comunica con tre
mezzi: cambi di carta (Carta del Menu → Sottobicchiere per ciò che è
"appoggiato"), bordi in Ottone del Bancone, e il colore pieno del Verde
Bottiglia per ciò che è cornice. L'unica eccezione tollerata è il backdrop
scuro del pop-up (`rgb(0 0 0 / 0.55)`), che è oscuramento, non ombra.

### Named Rules
**La Regola della Carta.** `box-shadow` è proibito. Se un elemento deve
staccarsi, cambia carta o prende un bordo d'ottone.

## 5. Components

Carattere complessivo: **solidi e composti** — forme squadrate appena smussate
(4px), niente effetti, stati sobri. La solidità del bancone di legno.

### Buttons
- **Shape:** angoli appena smussati (4px), nessuna ombra.
- **Primary:** Verde Bottiglia pieno, testo bianco, padding 7px 16px
  (pannello admin e "Chiudi" del pop-up).
- **Hover / Focus:** nessuna transizione decorativa; focus visibile nativo.
- **Pericolo (solo admin):** Mattone pieno, dentro `<details>` di conferma.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** Sottobicchiere su Carta del Menu.
- **Shadow Strategy:** nessuna (vedi Elevation); bordo `1px` Ottone al 30–50%.
- **Internal Padding:** 16px.
- **Card evento:** blocchetto data 64×64 in Verde Bottiglia (giorno in
  Display, mese maiuscolo piccolo) + contenuto. È l'unico posto dove il verde
  appare "dentro" la pagina, e va guadagnato così.

### Inputs / Fields (solo pannello admin)
- **Style:** bordo 1px #b8a878 (ottone sbiadito), fondo bianco, 4px, padding
  7px 10px, etichette sopra il campo in grassetto.
- **Focus:** outline nativo del browser; niente glow.

### Navigation
- **Header:** barra Verde Bottiglia; nome del pub in Title color Oro della
  Spina + stemma (40px) a sinistra; link in Carta del Menu con hover Oro. Su
  mobile i link vanno a capo (niente hamburger: 2–4 voci).
- **Footer:** Verde Bottiglia, tre blocchi (contatti / orari / social) che si
  impilano sotto i 640px; link sottolineati con hover Oro.

### La riga del menu (signature)
Nome del piatto (semibold) — riga di puntini in Ottone al 40% — prezzo
(semibold, Verde Bottiglia), descrizione sotto in Stout al 70%, foto
facoltativa 96×96 a destra (4px). È il componente che dà il nome al sistema.

### Le targhette servizi (signature)
Loghi SVG ufficiali (Sky, DAZN, Serie A) centrati in targhette uniformi
176×96 su Sottobicchiere, bordo 2px Ottone al 50%: le placchette dietro al
bancone. Statiche per scelta esplicita del committente — il marquee animato è
stato respinto.

## 6. Do's and Don'ts

### Do:
- **Do** usare i filetti doppi (`3px double` Ottone) sotto ogni titolo di sezione: sono la segnatura tipografica del sito.
- **Do** usare le righe di puntini per ogni elenco nome-prezzo.
- **Do** tenere il testo su carta a contrasto pieno: Stout (#2b2418) e mai sotto il 70% di opacità.
- **Do** rispettare `prefers-reduced-motion` su qualunque movimento futuro, e tenere il corpo testo ≥16px (clientela non giovane, WCAG AA).
- **Do** progettare per contenuti veri e imperfetti: foto del gestore, descrizioni mancanti, prezzi che cambiano.

### Don't:
- **Don't** usare componenti "animati da libreria": il committente ha respinto un logo-marquee in stile ReactBits perché "estetica troppo moderna". Le superfici stanno ferme.
- **Don't** introdurre "landing page SaaS moderne: gradienti, glassmorphism, hero full-screen con parallax, metriche giganti" (anti-referenza testuale di PRODUCT.md).
- **Don't** usare `box-shadow` (La Regola della Carta) né border-left/right colorati come accento.
- **Don't** mettere Oro della Spina su carta chiara: contrasto insufficiente (La Regola dell'Oro).
- **Don't** ripetere etichette maiuscole spaziate sopra le sezioni: la tagline dell'hero è l'unica.
- **Don't** aggiungere font: due famiglie (IM Fell English + Lora) sono il sistema. Il gotico lo porta solo lo stemma.
- **Don't** usare pattern che esistono solo da TikTok in poi: "se non potrebbe stare su un menu stampato o un'insegna di legno, non appartiene al Chelsea".
