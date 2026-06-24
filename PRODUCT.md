# Product

## Register

brand

## Users

Clienti del Chelsea House, pub-birreria di Catania attivo dal 1993: habitué di
lunga data (il locale ha "cresciuto generazioni") e nuovi avventori che lo
scoprono cercando orari, menu, eventi o dove vedere la partita. Arrivano quasi
sempre dal telefono, spesso la sera, per una decisione rapida: "che orari fa?",
"cosa si mangia?", "c'è qualcosa stasera?". Utente secondario: il gestore, non
tecnico, che aggiorna contenuti dal pannello /admin.

## Product Purpose

Sito vetrina del Chelsea House. Deve far trovare in pochi secondi le
informazioni di servizio (orari, menu coi prezzi, eventi, contatti, servizi TV
come Sky/DAZN/Serie A) e trasmettere l'atmosfera del locale: mattoni, legno,
trent'anni di serate. Successo = la gente entra nel pub o chiama, e il gestore
aggiorna tutto da solo senza chiamare uno sviluppatore. Il sito è in italiano.

## Brand Personality

Britannico ma deciso, da **taproom** serale. Il Chelsea House resta un pub
inglese con trent'anni di storia, ma si racconta con piglio contemporaneo:
sala scura di legno e mattoni, ottone del bancone, l'ambra della birra contro
il nero del locale. L'emozione da evocare è quella della porta che si apre la
sera — calore, sei spine aperte, partita ai maxischermi — non la solennità da
museo né l'effetto cocktail bar. Tono di voce caldo e diretto; niente
entusiasmi da marketing.

> Direzione visiva attuale: **"Taproom"** (handoff giugno 2026). Sostituisce il
> precedente sistema "menu stampato del 1993", che sopravvive solo nella palette
> araldica del pannello /admin.

## Anti-references

- Look "carta chiara" / menu stampato per il sito pubblico: lo scuro (espresso)
  è default e identità. C'è un tema chiaro automatico che segue il dispositivo,
  ma è "il pub di giorno" sulla crema del brand, non pergamena. Stemma araldico
  e palette su carta restano solo nel pannello /admin.
- Minimalismo freddo da startup e template "ristorante contemporaneo".
- Cliché SaaS fini a se stessi: testo in gradiente, glassmorphism decorativo,
  metriche giganti.
- Pill e bordi arrotondati ovunque: il sistema è squadrato per scelta (solo
  tile foto/loghi prendono 4px).

## Design Principles

1. **Insegna, non interfaccia** — ogni superficie deve poter stare su
   un'insegna di birreria: tipografia condensata, maiuscole, filetti, ambra su
   scuro. Squadrato di default.
2. **L'ambra accende il buio** — l'identità nasce dal contrasto espresso/crema
   con un unico accento acceso, l'ambra/ottone della birra. Niente seconda
   tinta che compete.
3. **La foto è il design** — le sezioni image-led (hero, menu, sport, galleria)
   poggiano sulle foto del locale: portano loro l'atmosfera, il testo ci sta
   sopra.
4. **Prima gli orari e il menu** — è un sito di servizio: le informazioni che
   portano gente al pub (orari, menu coi prezzi, dove vedere la partita)
   vincono su ogni vezzo estetico.
5. **Regge i contenuti veri** — testi, foto, eventi e loghi arrivano dal
   pannello del gestore: il design resta dignitoso con foto imperfette,
   descrizioni assenti, pochi o nessun evento.

## Accessibility & Inclusion

WCAG 2.1 AA come base: contrasto ≥4.5:1 sul testo, leggibilità per clientela
non giovane (corpo testo mai sotto i 16px), target tattili comodi,
`prefers-reduced-motion` rispettato ovunque. Lingua: italiano (`lang="it"`).
