// Testi dell'interfaccia nelle due lingue. I contenuti dal pannello admin
// (menu, popup, descrizione) restano in italiano per scelta di prodotto.

export type Lang = 'it' | 'en'

export const haLingua = (l: string): l is Lang => l === 'it' || l === 'en'

/** URL equivalente nella lingua data: l'italiano resta sugli URL puliti. */
export function percorso(lang: Lang, p: string): string {
  if (lang === 'it') return p
  if (p === '/') return '/en'
  if (p.startsWith('/#')) return `/en${p.slice(1)}`
  return `/en${p}`
}

const it = {
  locale: 'it-IT',
  nav: {
    principale: 'Principale',
    birre: 'Birre',
    menu: 'Menu',
    dove: 'Dove siamo',
    apriMenu: 'Apri menu',
    chiudiMenu: 'Chiudi menu',
    cambiaLingua: 'Switch to English',
    linguaBreve: 'EN',
  },
  footer: {
    slogan: 'Fermati. Accomodati. Resta.',
    orari: 'Orari',
    contatti: 'Contatti',
    esplora: 'Esplora',
    indicazioniMaps: 'Indicazioni su Maps',
    galleria: 'Galleria',
    copyright: (nome: string) => `© ${nome} · British Pub · Imola · dal 1993`,
  },
  home: {
    kicker: 'British Pub · dal 1993',
    vediMenu: 'Vedi il menu',
    band: '30+ anni a Imola',
    titoloStoria: 'Un angolo d’Inghilterra a Imola',
    raccontoDefault:
      'Bancone in legno scuro, bicchieri appesi e l’atmosfera dei pub d’oltremanica. Buona compagnia, cucina semplice e una selezione di birre, cocktail e amari — dal 1993.',
    laSelezione: 'La selezione',
    nostreBirre: 'Le nostre birre',
    birreBlurb:
      'Sei spine al bancone, dalla Guinness alla lager continentale. Chiedi al banco cosa c’è in spillatura stasera.',
    laCarta: 'La carta',
    ilMenu: 'Il menu',
    menuBlurb:
      'Birre alla spina e in bottiglia, cocktail, bibite, amari e cucina da pub. Con un occhio di riguardo per le birre.',
    laSala: 'La sala',
    tuttaGalleria: 'Tutta la galleria',
    altBancone: 'Il bancone in legno scuro, bicchieri appesi',
    altPinta: 'Una pinta appena spillata al bancone',
    altSala: 'La sala del pub, luci calde e boiserie',
    altPinte: (nome: string) => `Pinte appena spillate al bancone del ${nome}`,
    altFoto: (nome: string) => `Foto di ${nome}`,
  },
  menu: {
    titolo: 'Il menu',
    inAggiornamento: 'Il menu è in aggiornamento.',
    chiama: 'Chiama per la carta di stasera',
    chiedi: 'Chiedi su Instagram',
    vediTutto: 'Vedi tutto',
  },
  galleria: {
    titolo: 'Il locale',
    fotoPresto: 'Le foto arrivano presto.',
    notaInstagram: 'Le ultime foto dal nostro Instagram — tocca una foto per aprire il post.',
    apriPost: 'Apri il post su Instagram',
  },
  dove: {
    titolo: 'Dove siamo',
    comeArrivare: 'Come arrivare',
    testoConIndirizzo: (indirizzo: string) =>
      `Ci trovi a ${indirizzo}. Cerca l’insegna d’ottone e le vetrine calde: dentro, legno scuro, birre alla spina e l’atmosfera di un vero british pub.`,
    testoSenzaIndirizzo:
      'Cerca l’insegna d’ottone e le vetrine calde: dentro, legno scuro, birre alla spina e l’atmosfera di un vero british pub. Apri le indicazioni e Google Maps ti porta dritto al pub.',
    indirizzo: 'Indirizzo',
    orari: 'Orari',
    telefono: 'Telefono',
    indicazioniGoogle: 'Indicazioni con Google Maps',
    sullaMappa: 'Sulla mappa',
    vediSuMaps: 'Vedi su Google Maps →',
  },
  popup: { chiudi: 'Chiudi' },
}

const en: typeof it = {
  locale: 'en-GB',
  nav: {
    principale: 'Main',
    birre: 'Beers',
    menu: 'Menu',
    dove: 'Find us',
    apriMenu: 'Open menu',
    chiudiMenu: 'Close menu',
    cambiaLingua: 'Passa all’italiano',
    linguaBreve: 'IT',
  },
  footer: {
    slogan: 'Stop in. Sit down. Stay a while.',
    orari: 'Opening hours',
    contatti: 'Contacts',
    esplora: 'Explore',
    indicazioniMaps: 'Directions on Maps',
    galleria: 'Gallery',
    copyright: (nome: string) => `© ${nome} · British Pub · Imola · since 1993`,
  },
  home: {
    kicker: 'British Pub · since 1993',
    vediMenu: 'See the menu',
    band: '30+ years in Imola',
    titoloStoria: 'A corner of England in Imola',
    raccontoDefault:
      'A dark wooden bar, glasses hanging overhead and the feel of a proper British pub. Good company, simple food and a fine selection of beers, cocktails and bitters — since 1993.',
    laSelezione: 'The selection',
    nostreBirre: 'Our beers',
    birreBlurb:
      'Six taps at the bar, from Guinness to continental lager. Ask at the counter what’s pouring tonight.',
    laCarta: 'Food & drink',
    ilMenu: 'The menu',
    menuBlurb:
      'Draught and bottled beers, cocktails, soft drinks, bitters and pub kitchen classics. With a special eye for the beers.',
    laSala: 'Inside the pub',
    tuttaGalleria: 'See the full gallery',
    altBancone: 'The dark wooden bar, glasses hanging overhead',
    altPinta: 'A freshly poured pint at the bar',
    altSala: 'The pub room, warm lights and wood panelling',
    altPinte: (nome: string) => `Freshly poured pints at the ${nome} bar`,
    altFoto: (nome: string) => `Photo of ${nome}`,
  },
  menu: {
    titolo: 'Our menu',
    inAggiornamento: 'The menu is being updated.',
    chiama: 'Call for tonight’s menu',
    chiedi: 'Ask us on Instagram',
    vediTutto: 'See all',
  },
  galleria: {
    titolo: 'The pub',
    fotoPresto: 'Photos coming soon.',
    notaInstagram: 'The latest photos from our Instagram — tap a photo to open the post.',
    apriPost: 'Open the post on Instagram',
  },
  dove: {
    titolo: 'Find us',
    comeArrivare: 'How to get here',
    testoConIndirizzo: (indirizzo: string) =>
      `You’ll find us at ${indirizzo}. Look for the brass sign and the warm windows: inside, dark wood, beers on tap and the feel of a proper British pub.`,
    testoSenzaIndirizzo:
      'Look for the brass sign and the warm windows: inside, dark wood, beers on tap and the feel of a proper British pub. Open the directions and Google Maps will take you straight to the door.',
    indirizzo: 'Address',
    orari: 'Opening hours',
    telefono: 'Phone',
    indicazioniGoogle: 'Directions with Google Maps',
    sullaMappa: 'On the map',
    vediSuMaps: 'View on Google Maps →',
  },
  popup: { chiudi: 'Close' },
}

const dizionari = { it, en }

export type Dizionario = typeof it

export const dizionario = (lang: Lang): Dizionario => dizionari[lang]
