# Product

## Register

brand

## Users

Clienti del **Chelsea House**, british pub di **Imola** attivo dal 1993: habitué
di lunga data (il locale ha "cresciuto generazioni") e nuovi avventori che lo
scoprono cercando orari, menu o l'atmosfera del posto. Arrivano quasi sempre dal
telefono, spesso la sera, per una decisione rapida: "che orari fa?", "cosa si
beve / si mangia?". Utente secondario: il gestore, non tecnico, che aggiorna
contenuti dal pannello /admin.

## Product Purpose

Sito vetrina del Chelsea House. Deve far trovare in pochi secondi le
informazioni di servizio (orari, menu coi prezzi, contatti, dove siamo) e
trasmettere l'atmosfera del locale: il verde British, il legno, trent'anni di
serate. Successo = la gente entra nel pub o chiama, e il gestore aggiorna tutto
da solo senza chiamare uno sviluppatore. Il sito è in italiano.

> La direzione "Black Friar" (giugno 2026) ha tolto dalla home le sezioni
> **Sport (Sky/DAZN)** e **Serate/eventi** del vecchio Taproom. I dati restano
> gestibili dal pannello, ma non sono più esposti in home: scelta di prodotto,
> non limite tecnico. Se "dove vedo la partita?" tornasse centrale, va
> reintrodotto come superficie dedicata.

## Brand Personality

Britannico ma deciso. Il Chelsea House è un british pub con trent'anni di
storia, raccontato con piglio contemporaneo: il **verde racing** della sala, la
crema dei bicchieri, l'**oro/ottone** dell'insegna. L'emozione da evocare è
quella della porta che si apre la sera — calore, legno scuro, atmosfera da pub
vero — non la solennità da museo né l'effetto cocktail bar. Tono di voce caldo e
diretto; niente entusiasmi da marketing.

> Direzione visiva attuale: **"Black Friar"** (handoff giugno 2026). Verde
> British drenched, accento oro, serif scolpito (Cinzel + EB Garamond), sezioni
> "carta" su texture a grana. Sostituisce la direzione "Taproom" (espresso/ambra,
> Oswald). La palette araldica su carta sopravvive solo nel pannello /admin.

## Anti-references

- Minimalismo freddo da startup e template "ristorante contemporaneo".
- Cliché SaaS fini a se stessi: testo in gradiente, glassmorphism decorativo,
  metriche giganti.
- Pill e bordi arrotondati ovunque: il sistema è **squadrato per scelta**.
- Seconda tinta accesa accanto all'oro: l'accento è uno solo, il calore in più
  lo portano le foto.
- Eyebrow (etichettina maiuscola) sopra ogni sezione: è un gesto misurato, non
  una grammatica ripetuta.

## Design Principles

1. **Insegna scolpita** — i titoli sono Cinzel, capitali serif come incise su
   una targa d'ottone. Squadrato di default.
2. **Un solo oro, due fondi** — l'identità nasce dall'alternanza verde "sala" /
   crema "documento", con un unico accento oro che cambia tono col fondo (chiaro
   sul verde, scuro sulla carta). Niente seconda tinta che compete.
3. **La foto è il design** — hero e galleria poggiano sulle foto del locale:
   portano loro l'atmosfera, il testo ci sta sopra.
4. **Prima gli orari e il menu** — è un sito di servizio: le info che portano
   gente al pub (orari nell'hero, menu coi prezzi) vincono su ogni vezzo
   estetico.
5. **Regge i contenuti veri** — testi, foto, menu e loghi arrivano dal pannello
   del gestore: il design resta dignitoso con foto imperfette, descrizioni
   assenti, menu vuoto. I fallback ci sono.

## Accessibility & Inclusion

WCAG 2.1 AA come base: contrasto ≥4.5:1 sul testo (oro-scuro #7e5b1f per il
testo piccolo su carta, oro-ink #f2cb5c sul verde — entrambi verificati),
leggibilità per clientela non giovane (corpo testo mai sotto i 16px), target
tattili comodi, `prefers-reduced-motion` rispettato. Lingua: italiano
(`lang="it"`).
