---
name: Chelsea House
description: Pub inglese classico — verde bottiglia, insegna serif, ottone e carta del menu.
colors:
  verde: "#143b2d"
  verde-profondo: "#0c281f"
  crema: "#f4eddb"
  ottone: "#d4b16b"
  testo-secondario: "#d4cebb"
  filetto: "#8c794b"
  inchiostro-carta: "#143b2d"
  testo-secondario-carta: "#586052"
  ottone-carta: "#76551f"
  filetto-carta: "#b8a77d"
typography:
  display:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.06
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "20px"
    lineHeight: 1.65
rounded:
  none: "0"
---

# Chelsea House — pub inglese classico

La facciata digitale riprende un'insegna dipinta, i filetti d'ottone e la carta
stampata di un public house. La prima schermata mostra il locale: foto reale,
nome, presentazione e azioni per consultare il menu o raggiungere il pub.

## Identità e superfici

- Verde bottiglia `#143b2d` per il sito, verde profondo `#0c281f` per nav e footer.
- Testo crema `#f4eddb`, secondario `#d4cebb`, ottone `#d4b16b` per accenti e prezzi.
- Sezioni birre, galleria, menu completo e contatti su carta crema con la texture
  raster esistente. Su carta: inchiostro verde, testo secondario `#586052`,
  ottone scuro `#76551f` e filetti `#b8a77d`.
- Nessun arrotondamento, ombra decorativa o superficie in vetro.
- L'hero ha un doppio filetto sottile: richiama la cornice di un'insegna.

## Tipografia

Cinzel per insegna e titoli; EB Garamond per testo, navigazione, menu e prezzi.
I font restano quelli già self-hostati con `next/font`. Corpo 20px, descrizioni
menu 18px, prezzi 21–22px con cifre tabulari. I titoli non superano 96px.
Le impostazioni di carattere e accento continuano a valere per clienti non legacy.

## Composizione e comportamento

- Nav verde fissa durante lo scorrimento, 90px desktop e 78px su mobile.
  Sotto 860px usa un menu espandibile, chiudibile con Escape.
- Hero fotografico a tutta larghezza, overlay per la leggibilità, testo
  centrato, due azioni. Gli orari, l'indirizzo e il telefono seguono subito.
- Racconto del Chelsea House con foto della pinta e breve testo sul locale.
- Selezione birre: sei marchi su carta; tre colonne su tablet, due su telefono.
- Menu in home: tutti i filtri sono disponibili a ogni larghezza. Pulsanti
  nativi con `aria-pressed`, senza semantica tab incompleta. Righe su due
  colonne desktop e una su mobile; collegamento al menu completo sempre visibile.
- Menu completo su carta incorniciata, indice iniziale per raggiungere le
  categorie senza scorrere tutte le birre prima di trovare il cibo.
- Galleria fotografica con composizione ampia e immagini squadrate.
  I segnaposto `demo-foto-*` del seed legacy vengono sostituiti in presentazione
  dalle foto reali del bundle. Le foto caricate dal gestore mantengono precedenza.
- Pagina contatti con informazioni leggibili, indicazioni e foto del locale.
- Footer con insegna, slogan, orari, contatti e collegamenti.
- Sezioni eventi/servizi continuano a rispettare le opzioni del pannello.

## Accessibilità e isolamento

Contrasti verificati: ottone/verde 6.08:1; testo secondario/verde 7.88:1;
testo secondario/carta 5.60:1; ottone scuro/carta 5.82:1.
Controlli principali da almeno 44px, focus visibile e link per saltare al
contenuto. Un'unica entrata discreta nell'hero; animazioni e transizioni
si disattivano con `prefers-reduced-motion`.

Gli stili sono in `app/[lang]/(sito)/pub.css`, sotto `.pub-site` o classi
`pub-*`. Il foglio globale, i componenti UI condivisi e il pannello admin
non vengono modificati da questa direzione.

## Pannello amministrativo (ottobre 2026)

L'admin usa Geist, superfici bianche e neutre, testo scuro e verde come accento
per azioni e selezione. Non segue i font decorativi delle precedenti versioni
del sito. La navigazione laterale distingue gestione quotidiana e configurazione;
su mobile diventa un menu espandibile. I controlli mantengono dimensioni e
spaziature uniformi, con stati di focus, attesa, errore e successo.
La Panoramica parte dalle attività. Galleria seleziona le immagini; Instagram
gestisce connessione e sincronizzazione. CSS limitato al pannello in
`app/admin/admin.css`, senza modificare il tema del sito pubblico.
