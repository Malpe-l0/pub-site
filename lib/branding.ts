import type { Lang } from './dizionario'
export type Birra = { nome: string; stile: string; logo: string }
export type Branding = {
  legacy?: boolean;
  colore: string; font: 'sans' | 'serif'; logo: string; hero: string; heroAlt: string;
  birre: Birra[]; sezioni: { birre: boolean; menu: boolean; galleria: boolean; eventi: boolean; servizi: boolean };
  testi: Record<Lang, Record<string, string>>;
}
export const CAMPI_TESTO = {
  'home.kicker': 'Frase sopra il nome', 'home.raccontoDefault': 'Presentazione',
  'home.nostreBirre': 'Titolo birre', 'home.birreBlurb': 'Introduzione alle birre',
  'home.ilMenu': 'Titolo menu', 'home.menuBlurb': 'Introduzione al menu',
  'home.laSala': 'Titolo foto del locale', 'footer.slogan': 'Slogan nel fondo pagina',
  'footer.nota': 'Nota nel fondo pagina', 'dove.presentazione': 'Presentazione nella pagina contatti',
} as const
export const BIRRE_STORICHE: Birra[] = [
  { nome:'Guinness',stile:'Irish Stout',logo:'/taproom/logo-guinness.png' },
  { nome:'Kilkenny',stile:'Irish Red Ale',logo:'/taproom/logo-kilkenny.png' },
  { nome:'Bass',stile:'English Pale Ale',logo:'/taproom/logo-bass.png' },
  { nome:'Hobgoblin',stile:'Ruby Ale',logo:'/taproom/logo-hobgoblin.png' },
  { nome:'Arcobräu',stile:'German Lager',logo:'/taproom/logo-arcobrau.png' },
  { nome:'San Miguel',stile:'Premium Lager',logo:'/taproom/logo-sanmiguel.png' },
]
export function leggiBranding(value: string): Branding {
  const raw = JSON.parse(value) as Partial<Branding> & { legacy?: boolean }
  const generici = {
    it: {'home.kicker':'Benvenuti', 'home.raccontoDefault':'Un luogo dove incontrarsi e stare bene. Scopri la nostra proposta e vieni a trovarci.', 'home.birreBlurb':'Scopri la nostra selezione e chiedici le novità.', 'home.menuBlurb':'Consulta la nostra proposta e i prezzi aggiornati.', 'footer.slogan':'Ti aspettiamo.', 'dove.presentazione':'Qui trovi indirizzo, orari e contatti per organizzare la tua visita.'},
    en: {'home.kicker':'Welcome', 'home.raccontoDefault':'A place to meet and enjoy good company. Discover what we offer and come visit us.', 'home.birreBlurb':'Explore our selection and ask us what is new.', 'home.menuBlurb':'Explore our menu and current prices.', 'footer.slogan':'We look forward to seeing you.', 'dove.presentazione':'Find our address, opening hours and contact details to plan your visit.'},
  }
  return {
    legacy: raw.legacy,
    colore: raw.colore || '#7e5b1f', font: raw.font === 'serif' ? 'serif' : 'sans',
    logo: raw.logo || '', hero: raw.hero ?? (raw.legacy ? '/taproom/foto-sala.jpg' : ''), heroAlt: raw.heroAlt || '',
    birre: raw.birre || (raw.legacy ? BIRRE_STORICHE : []),
    sezioni: { birre:true,menu:true,galleria:true,eventi:false,servizi:false,...raw.sezioni },
    testi: { it: {...(raw.legacy ? {} : generici.it),...raw.testi?.it}, en: {...(raw.legacy ? {} : generici.en),...raw.testi?.en} },
  }
}
export function testoBrand(brand: Branding, lang: Lang, key: string, fallback: string) {
  return brand.testi[lang][key] ?? fallback
}
export function coloreTesto(hex: string) {
  const c = hex.slice(1).match(/../g)!.map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4)
  return .2126*c[0]+.7152*c[1]+.0722*c[2] > .179 ? '#09090b' : '#ffffff'
}
export function assetValido(value: string) {
  return value === '' || /^\/uploads\/[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}\.(webp|svg)$/.test(value) && !value.includes('..') || /^\/taproom\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(value)
}

export function coloreAccessibile(hex: string) {
  let c=hex
  for (let i=0;i<25;i++) {
    const rgb=c.slice(1).match(/../g)!.map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4)
    if (1.05/(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]+.05)>=4.5) return c
    c='#'+c.slice(1).match(/../g)!.map(v=>Math.floor(parseInt(v,16)*.9).toString(16).padStart(2,'0')).join('')
  }
  return '#09090b'
}
