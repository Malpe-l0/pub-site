'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { salvaPunteggio } from '@/app/(sito)/gioco/azioni'

/**
 * La spillata perfetta: tieni premuto per spillare, rilascia sulla zona
 * segnata prima di traboccare. Una spillata sbagliata chiude la serata.
 * Tutto disegnato in caratteri dentro un <pre>, come il resto del menu.
 */

// Ogni bicchiere è disegnato a mano riga per riga (dall'orlo al fondo):
// `pre` e `post` sono pareti e aria, `w` è la larghezza interna da riempire.
// Tutte le righe di uno stesso bicchiere hanno la stessa lunghezza totale.
type RigaBicchiere = { pre: string; post: string; w: number }
type Bicchiere = {
  nome: string
  altezza: number // = righe.length, comodo averlo esplicito
  righe: RigaBicchiere[]
  sopra: string // orlo
  sotto: string[] // base ed eventuale stelo
}

const PINTA: Bicchiere = {
  nome: 'la pinta',
  altezza: 10,
  sopra: '  .────────────.  ',
  righe: [
    { pre: '  │', post: '│  ', w: 12 },
    { pre: '  │', post: '│  ', w: 12 },
    { pre: '  │', post: '│  ', w: 12 },
    { pre: '  \\', post: '/  ', w: 12 },
    { pre: '   │', post: '│   ', w: 10 },
    { pre: '   │', post: '│   ', w: 10 },
    { pre: '   \\', post: '/   ', w: 10 },
    { pre: '    │', post: '│    ', w: 8 },
    { pre: '    │', post: '│    ', w: 8 },
    { pre: '    │', post: '│    ', w: 8 },
  ],
  sotto: ['    └────────┘    '],
}

const BOCCALE: Bicchiere = {
  nome: 'il boccale',
  altezza: 8,
  sopra: '  .────────────.   ',
  righe: [
    { pre: '  │', post: '│   ', w: 12 },
    { pre: '  │', post: '│─┐ ', w: 12 },
    { pre: '  │', post: '│ │ ', w: 12 },
    { pre: '  │', post: '│ │ ', w: 12 },
    { pre: '  │', post: '│─┘ ', w: 12 },
    { pre: '  │', post: '│   ', w: 12 },
    { pre: '  │', post: '│   ', w: 12 },
    { pre: '  │', post: '│   ', w: 12 },
  ],
  sotto: ['  └────────────┘   '],
}

const CALICE: Bicchiere = {
  nome: 'il calice',
  altezza: 5,
  sopra: '   .──────────.   ',
  righe: [
    { pre: '   │', post: '│   ', w: 10 },
    { pre: '   │', post: '│   ', w: 10 },
    { pre: '   \\', post: '/   ', w: 10 },
    { pre: '    \\', post: '/    ', w: 8 },
    { pre: '     \\', post: '/     ', w: 6 },
  ],
  sotto: ['      └──────┘    ', '         ││       ', '       ──────     '],
}

const BICCHIERI: Bicchiere[] = [PINTA, BOCCALE, CALICE]
const PINTE_PER_BICCHIERE = 3

function bicchierePerPinta(pinta: number): Bicchiere {
  return BICCHIERI[Math.floor((pinta - 1) / PINTE_PER_BICCHIERE) % BICCHIERI.length]
}

function velocitaPerPinta(pinta: number): number {
  return Math.min(22, 5.5 * Math.pow(1.07, pinta - 1)) // righe al secondo
}

function zonaPerPinta(pinta: number, altezza: number): { bassa: number; alta: number } {
  const larghezza = Math.max(0.8, 2.4 * Math.pow(0.93, pinta - 1))
  const alta = altezza - 0.7
  return { bassa: alta - larghezza, alta }
}

/** Birra con qualche bollicina che sale: posizioni pseudo-casuali ma stabili. */
function rigaBirra(w: number, fondo: number, faseBolle: number): string {
  const caratteri = Array.from({ length: w }, () => '▓')
  if (faseBolle > 0) {
    caratteri[(fondo * 37 + faseBolle * 5) % w] = '°'
    if (w > 8) caratteri[(fondo * 61 + faseBolle * 13) % w] = '°'
  }
  return caratteri.join('')
}

function disegna(
  bicchiere: Bicchiere,
  livello: number,
  spillando: boolean,
  zona: { bassa: number; alta: number },
  faseBolle: number,
  trabocco: boolean
): string {
  const { altezza, righe, sopra, sotto } = bicchiere
  const linee: string[] = []

  if (trabocco) {
    // La schiuma scavalca l'orlo e cola sulle pareti.
    const inizio = sopra.search(/[.─]/)
    const fine = sopra.length - [...sopra].reverse().join('').search(/[.─]/)
    linee.push('  ' + ' '.repeat(inizio) + '░'.repeat(Math.max(0, fine - inizio)))
    linee.push('  ' + sopra.replace(/─/g, '▒'))
  } else {
    linee.push('  ' + sopra)
  }

  for (let i = 0; i < altezza; i++) {
    const riga = righe[i]
    const fondo = altezza - 1 - i // la riga occupa [fondo, fondo+1)
    let interno: string
    if (trabocco) {
      interno = fondo >= altezza - 2 ? '░'.repeat(riga.w) : rigaBirra(riga.w, fondo, faseBolle)
    } else if (livello >= fondo + 1) {
      interno = rigaBirra(riga.w, fondo, faseBolle)
    } else if (livello > fondo) {
      // superficie: schiuma che monta mentre spilli, cappello quando ti fermi
      interno = (spillando ? '▒' : '░').repeat(riga.w)
    } else {
      interno = ' '.repeat(riga.w)
    }

    // La "riga della pinta": tacche sul vetro all'altezza giusta, come
    // sui bicchieri veri. Solo sulle pareti dritte.
    const inZona = fondo + 1 > zona.bassa && fondo < zona.alta
    let { pre, post } = riga
    if (inZona && pre.endsWith('│')) {
      pre = pre.slice(0, -1) + '├'
      post = '┤' + post.slice(1)
    }
    linee.push((inZona ? '► ' : '  ') + pre + interno + post)
  }

  for (const base of sotto) linee.push('  ' + base)
  return linee.join('\n')
}

type Fase = 'attesa' | 'gioco' | 'verdetto' | 'pausa' | 'fine' | 'inviato'

function frameIniziale(): string {
  // In attesa si mostra una pinta servita a regola d'arte, col suo cappello.
  const zona = zonaPerPinta(1, PINTA.altezza)
  return disegna(PINTA, (zona.bassa + zona.alta) / 2, false, zona, 0, false)
}

export function SpillataPerfetta({ token }: { token: string }) {
  const router = useRouter()
  const [inviando, avviaInvio] = useTransition()

  const [fase, setFase] = useState<Fase>('attesa')
  const [pinta, setPinta] = useState(1)
  const [punti, setPunti] = useState(0)
  const [frame, setFrame] = useState(frameIniziale)
  const [messaggio, setMessaggio] = useState('')
  const [annuncio, setAnnuncio] = useState('') // per aria-live
  const [sigla, setSigla] = useState('')
  const [posizione, setPosizione] = useState<number | null>(null)
  const [erroreInvio, setErroreInvio] = useState('')

  // Stato del loop fuori da React: il rAF legge e scrive qui.
  const ref = useRef({
    fase: 'attesa' as Fase,
    pinta: 1,
    punti: 0,
    livello: 0,
    spillando: false,
    trabocco: false,
    ultimoT: 0,
    rafId: 0,
    timeoutId: 0,
    inizioPartita: 0,
  })

  const aggiornaFrame = useCallback(() => {
    const s = ref.current
    const bicchiere = bicchierePerPinta(s.pinta)
    const faseBolle = s.spillando || s.trabocco ? Math.floor(performance.now() / 180) : 0
    setFrame(
      disegna(
        bicchiere,
        s.livello,
        s.spillando,
        zonaPerPinta(s.pinta, bicchiere.altezza),
        faseBolle,
        s.trabocco
      )
    )
  }, [])

  const cambiaFase = useCallback((nuova: Fase) => {
    ref.current.fase = nuova
    setFase(nuova)
  }, [])

  const gameOver = useCallback(
    (motivo: string) => {
      const s = ref.current
      s.spillando = false
      cancelAnimationFrame(s.rafId)
      cambiaFase('fine')
      setMessaggio(motivo)
      setAnnuncio(`${motivo} Punteggio finale: ${s.punti}.`)
      aggiornaFrame()
    },
    [aggiornaFrame, cambiaFase]
  )

  const tick = useCallback(
    (t: number) => {
      const s = ref.current
      if (s.fase !== 'gioco' || !s.spillando) return
      const dt = Math.min(0.1, (t - s.ultimoT) / 1000)
      s.ultimoT = t
      const bicchiere = bicchierePerPinta(s.pinta)
      s.livello += velocitaPerPinta(s.pinta) * dt
      if (s.livello >= bicchiere.altezza) {
        s.livello = bicchiere.altezza
        s.trabocco = true
        gameOver('Traboccata!')
        return
      }
      aggiornaFrame()
      s.rafId = requestAnimationFrame(tick)
    },
    [aggiornaFrame, gameOver]
  )

  const avviaPartita = useCallback(() => {
    ref.current.inizioPartita = Date.now()
    ref.current.livello = 0
    cambiaFase('gioco')
    aggiornaFrame()
  }, [aggiornaFrame, cambiaFase])

  const iniziaSpillata = useCallback(() => {
    const s = ref.current
    if (s.fase === 'pausa') cambiaFase('gioco')
    if (s.fase !== 'gioco' || s.spillando) return
    s.spillando = true
    s.ultimoT = performance.now()
    s.rafId = requestAnimationFrame(tick)
  }, [cambiaFase, tick])

  const fineSpillata = useCallback(() => {
    const s = ref.current
    if (s.fase !== 'gioco' || !s.spillando) return
    s.spillando = false
    cancelAnimationFrame(s.rafId)

    const bicchiere = bicchierePerPinta(s.pinta)
    const zona = zonaPerPinta(s.pinta, bicchiere.altezza)
    if (s.livello < zona.bassa) {
      gameOver('Troppo poca!')
      return
    }
    if (s.livello > zona.alta) {
      gameOver('Oltre la riga!')
      return
    }

    const centro = (zona.bassa + zona.alta) / 2
    const mezza = (zona.alta - zona.bassa) / 2
    const bonus = Math.round(10 * Math.max(0, 1 - Math.abs(s.livello - centro) / mezza))
    const guadagno = 10 + bonus
    s.punti += guadagno
    setPunti(s.punti)
    setMessaggio(`Pinta servita! +${guadagno}`)
    setAnnuncio(`Pinta ${s.pinta} servita, più ${guadagno} punti.`)
    cambiaFase('verdetto')
    aggiornaFrame()

    s.timeoutId = window.setTimeout(() => {
      s.pinta += 1
      s.livello = 0
      setPinta(s.pinta)
      setMessaggio('')
      cambiaFase('gioco')
      aggiornaFrame()
    }, 800)
  }, [aggiornaFrame, cambiaFase, gameOver])

  const rigioca = useCallback(() => {
    const s = ref.current
    window.clearTimeout(s.timeoutId)
    s.pinta = 1
    s.punti = 0
    s.livello = 0
    s.spillando = false
    s.trabocco = false
    setPinta(1)
    setPunti(0)
    setMessaggio('')
    setSigla('')
    setPosizione(null)
    setErroreInvio('')
    setFrame(frameIniziale())
    cambiaFase('attesa')
  }, [cambiaFase])

  // Rilascio anche fuori dall'area di gioco; pausa quando la pagina sparisce.
  useEffect(() => {
    const suRilascio = () => fineSpillata()
    const suVisibilita = () => {
      const s = ref.current
      if (document.hidden && s.fase === 'gioco') {
        s.spillando = false
        cancelAnimationFrame(s.rafId)
        cambiaFase('pausa')
        aggiornaFrame()
      }
    }
    const s = ref.current
    window.addEventListener('pointerup', suRilascio)
    window.addEventListener('pointercancel', suRilascio)
    document.addEventListener('visibilitychange', suVisibilita)
    return () => {
      window.removeEventListener('pointerup', suRilascio)
      window.removeEventListener('pointercancel', suRilascio)
      document.removeEventListener('visibilitychange', suVisibilita)
      cancelAnimationFrame(s.rafId)
      window.clearTimeout(s.timeoutId)
    }
  }, [aggiornaFrame, cambiaFase, fineSpillata])

  const suTasto = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'Enter') return
      e.preventDefault()
      if (e.type === 'keydown' && !e.repeat) iniziaSpillata()
      if (e.type === 'keyup') fineSpillata()
    },
    [fineSpillata, iniziaSpillata]
  )

  const invia = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const s = ref.current
      const durataMs = Date.now() - s.inizioPartita
      setErroreInvio('')
      avviaInvio(async () => {
        const esito = await salvaPunteggio(token, sigla, s.punti, durataMs)
        if (esito.esito === 'ok') {
          setPosizione(esito.posizione)
          cambiaFase('inviato')
          setAnnuncio(`Punteggio registrato: posizione ${esito.posizione} in classifica.`)
          router.refresh()
        } else {
          setErroreInvio(esito.messaggio)
        }
      })
    },
    [avviaInvio, cambiaFase, router, sigla, token]
  )

  const bicchiere = bicchierePerPinta(pinta)
  const inPartita = fase === 'gioco' || fase === 'verdetto' || fase === 'pausa'

  return (
    <div className="border-ottone/50 bg-pergamena mx-auto max-w-md rounded border-2 p-4">
      <p aria-live="polite" className="sr-only">
        {annuncio}
      </p>

      {fase === 'attesa' && (
        <div className="text-center">
          <pre aria-hidden className="font-mono inline-block text-left leading-tight">
            {frame}
          </pre>
          <p className="mt-3">
            Tieni premuto per spillare, lascia andare quando la birra è tra le tacche segnate sul
            vetro (►). Se trabocca o resta corta, la serata finisce lì.
          </p>
          <button
            type="button"
            onClick={avviaPartita}
            className="bg-verde text-crema mt-4 min-h-11 cursor-pointer rounded px-5 py-2"
          >
            Comincia il turno
          </button>
        </div>
      )}

      {inPartita && (
        <div
          role="application"
          aria-label="Gioco della spillata: tieni premuto il dito o la barra spaziatrice per spillare, rilascia per fermare"
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault()
            iniziaSpillata()
          }}
          onKeyDown={suTasto}
          onKeyUp={suTasto}
          onContextMenu={(e) => e.preventDefault()}
          className="cursor-pointer text-center select-none"
          style={{ touchAction: 'none' }}
        >
          <p className="font-titoli text-verde">
            Pinta {pinta} — {bicchiere.nome} · Punti {punti}
          </p>
          <pre aria-hidden className="font-mono inline-block text-left leading-tight">
            {frame}
          </pre>
          <p className="min-h-6">
            {fase === 'pausa' ? 'In pausa: tieni premuto per riprendere.' : messaggio || ' '}
          </p>
        </div>
      )}

      {(fase === 'fine' || fase === 'inviato') && (
        <div className="text-center">
          <pre aria-hidden className="font-mono inline-block text-left leading-tight">
            {frame}
          </pre>
          <p className="font-titoli text-verde mt-3 text-2xl">{messaggio}</p>
          <p className="mt-1">
            Punteggio finale: <strong>{punti}</strong> ({pinta - 1}{' '}
            {pinta - 1 === 1 ? 'pinta servita' : 'pinte servite'})
          </p>

          {fase === 'fine' && punti > 0 && (
            <form onSubmit={invia} className="mt-4">
              <label className="block">
                La tua sigla (tre lettere, come in sala giochi)
                <input
                  value={sigla}
                  onChange={(e) => setSigla(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  maxLength={3}
                  pattern="[A-Z]{3}"
                  required
                  autoComplete="off"
                  className="border-ottone/70 font-mono mx-auto mt-1 block w-24 rounded border bg-white px-2 py-2 text-center text-xl tracking-[0.3em] uppercase"
                />
              </label>
              {erroreInvio && (
                <p role="alert" className="text-mattone mt-2">
                  {erroreInvio}
                </p>
              )}
              <button
                disabled={inviando || sigla.length !== 3}
                className="bg-verde text-crema mt-3 min-h-11 cursor-pointer rounded px-5 py-2 disabled:cursor-default disabled:opacity-60"
              >
                {inviando ? 'Invio…' : 'Scrivi in classifica'}
              </button>
            </form>
          )}

          {fase === 'inviato' && posizione !== null && (
            <p className="mt-3">
              Sei al <strong>{posizione}º posto</strong> della classifica.
            </p>
          )}

          <button
            type="button"
            onClick={rigioca}
            className="border-ottone/70 text-verde mt-4 min-h-11 cursor-pointer rounded border bg-white px-5 py-2"
          >
            Rigioca
          </button>
        </div>
      )}
    </div>
  )
}
