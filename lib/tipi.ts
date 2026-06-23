export type FasciaOraria = { giorni: string; orario: string }

/** Struttura del sito pubblico: pagine separate oppure tutto in home con ancore. */
export type StileSito = 'multipagina' | 'onepage'

export type Impostazioni = {
  nomePub: string
  descrizione: string
  indirizzo: string
  telefono: string
  email: string
  facebook: string
  instagram: string
  orari: FasciaOraria[]
  stileSito: StileSito
}

export type Popup = {
  attivo: boolean
  titolo: string
  messaggio: string
  dataInizio: string | null // YYYY-MM-DD
  dataFine: string | null
}

export type Categoria = {
  id: number
  nome: string
  ordine: number
}

export type VoceMenu = {
  id: number
  nome: string
  descrizione: string
  prezzoCentesimi: number
  categoriaId: number
  disponibile: boolean
  ordine: number
  foto: string | null // nome file in data/uploads
}

export type CategoriaConVoci = Categoria & { voci: VoceMenu[] }

export type Evento = {
  id: number
  titolo: string
  dataOra: string // YYYY-MM-DDTHH:MM, ora italiana
  descrizione: string
  immagine: string | null
}

export type Servizio = {
  id: number
  nome: string
  logo: string | null
  ordine: number
  attivo: boolean
}

export type FotoGalleria = {
  id: number
  file: string
  didascalia: string
  ordine: number
}

/** Collegamento al profilo Instagram (account Business/Creator). */
export type InstagramConfig = {
  token: string
  tokenScadenza: string | null // ISO, stima di quando scade il token
  attivo: boolean
  username: string
  aggiornatoIl: string | null // datetime('now') di SQLite, UTC
  ultimoErrore: string
}

/** Un post di Instagram in cache. */
export type InstagramPost = {
  id: string
  permalink: string
  mediaUrl: string
  thumbnailUrl: string
  caption: string
  mediaType: string // IMAGE | VIDEO | CAROUSEL_ALBUM
  timestamp: string
}

/** Riga della classifica del gioco della spillata. */
export type Punteggio = {
  id: number
  sigla: string // tre lettere maiuscole, stile sala giochi
  punteggio: number
  creatoIl: string // datetime('now') di SQLite, UTC
}
