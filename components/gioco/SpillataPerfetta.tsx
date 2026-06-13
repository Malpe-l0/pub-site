'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { salvaPunteggio } from '@/app/(sito)/gioco/azioni'

/**
 * La spillata perfetta: tieni premuto per spillare, rilascia sulla fascia
 * dorata prima di traboccare. Una spillata sbagliata chiude la serata.
 * Una grande pinta da pub, illustrazione SVG piatta da etichetta di birreria.
 */

// Geometria della pinta nel viewBox 200×300: `contorno` è il vetro,
// `interno` il path che ritaglia il liquido, cima/fondo gli estremi utili.
type Bicchiere = {
  nome: string
  altezza: number // unità di gioco: la logica ragiona in "righe" come prima
  contorno: string
  interno: string
  cimaY: number
  fondoY: number
  orloCy: number
  orloRx: number
}

const PINTA: Bicchiere = {
  nome: 'la pinta',
  altezza: 10,
  contorno: 'M54 32 L74 260 Q76 268 84 268 L116 268 Q124 268 126 260 L146 32',
  interno: 'M59 36 L78 256 Q80 262 86 262 L114 262 Q120 262 122 256 L141 36 Z',
  cimaY: 42,
  fondoY: 258,
  orloCy: 32,
  orloRx: 46,
}

// Palette dell'illustrazione: la birra è ambrata come si deve, il resto
// resta nei colori dello stemma.
const BIRRA = '#d4912a'
const BIRRA_SCURA = '#a96f1c'
const BOLLA = '#edbe5e'
const SCHIUMA = '#fffdf7'
const VETRO = '#2b2418'

function velocitaPerPinta(pinta: number): number {
  return Math.min(22, 5.5 * Math.pow(1.07, pinta - 1)) // unità al secondo
}

function zonaPerPinta(pinta: number, altezza: number): { bassa: number; alta: number } {
  const larghezza = Math.max(0.8, 2.4 * Math.pow(0.93, pinta - 1))
  const alta = altezza - 0.7
  return { bassa: alta - larghezza, alta }
}

function BicchiereSvg({
  bicchiere,
  livello,
  spillando,
  trabocco,
  zona,
}: {
  bicchiere: Bicchiere
  livello: number
  spillando: boolean
  trabocco: boolean
  zona: { bassa: number; alta: number }
}) {
  const { altezza, cimaY, fondoY, orloCy, orloRx } = bicchiere
  const aY = (unita: number) => fondoY - (Math.min(unita, altezza) / altezza) * (fondoY - cimaY)

  const birraY = aY(livello)
  const schiumaAlta = livello <= 0 ? 0 : spillando ? 14 : 9
  const zonaAltaY = aY(zona.alta)
  const zonaBassaY = aY(zona.bassa)
  const conBirra = livello > 0

  return (
    <svg
      viewBox="0 0 200 300"
      width="200"
      height="300"
      role="img"
      aria-label={`${bicchiere.nome}, riempito al ${Math.round((livello / altezza) * 100)} per cento`}
      className="mx-auto block"
    >
      <defs>
        <clipPath id="clip-interno">
          <path d={bicchiere.interno} />
        </clipPath>
        <clipPath id="clip-birra">
          <rect x="30" y={birraY} width="140" height={Math.max(0, fondoY - birraY + 4)} />
        </clipPath>
      </defs>

      {/* Il rubinetto della spina, sempre presente sopra il bicchiere */}
      <g>
        <rect x="86" y="0" width="28" height="9" rx="2" fill="#1f3d2b" />
        <path d="M90 9 L110 9 L106 20 L94 20 Z" fill="#8a6d1f" />
      </g>
      {/* Il getto, solo mentre si spilla */}
      {spillando && !trabocco && (
        <rect x="96" y="20" width="8" height={Math.max(0, birraY - schiumaAlta - 20)} fill={BIRRA} opacity="0.9" />
      )}

      {/* La fascia dorata della spillata, dietro al vetro */}
      <g clipPath="url(#clip-interno)">
        <rect x="30" y={zonaAltaY} width="140" height={zonaBassaY - zonaAltaY} fill="#d4b14a" opacity="0.35" />
      </g>
      {/* Tacche della fascia, fuori dal vetro, con la freccia */}
      <line x1="30" y1={zonaAltaY} x2="52" y2={zonaAltaY} stroke="#8a6d1f" strokeWidth="2.5" />
      <line x1="30" y1={zonaBassaY} x2="52" y2={zonaBassaY} stroke="#8a6d1f" strokeWidth="2.5" />
      <path
        d={`M18 ${(zonaAltaY + zonaBassaY) / 2 - 7} L30 ${(zonaAltaY + zonaBassaY) / 2} L18 ${(zonaAltaY + zonaBassaY) / 2 + 7} Z`}
        fill="#8a6d1f"
      />

      {/* La birra */}
      {conBirra && (
        <g clipPath="url(#clip-interno)">
          <rect x="30" y={birraY} width="140" height={fondoY - birraY + 6} fill={BIRRA} />
          <line x1="30" y1={birraY + 1} x2="170" y2={birraY + 1} stroke={BIRRA_SCURA} strokeWidth="2" opacity="0.6" />
          {/* Bollicine che salgono, ritagliate dentro la birra */}
          <g clipPath="url(#clip-birra)">
            <circle className="bolla" cx="90" cy={fondoY - 8} r="2.6" fill={BOLLA} style={{ animationDuration: '2.1s' }} />
            <circle className="bolla" cx="104" cy={fondoY - 5} r="2" fill={BOLLA} style={{ animationDuration: '2.7s', animationDelay: '0.5s' }} />
            <circle className="bolla" cx="97" cy={fondoY - 12} r="1.6" fill={BOLLA} style={{ animationDuration: '1.8s', animationDelay: '1.1s' }} />
            <circle className="bolla" cx="111" cy={fondoY - 10} r="1.8" fill={BOLLA} style={{ animationDuration: '2.4s', animationDelay: '1.6s' }} />
            <circle className="bolla" cx="85" cy={fondoY - 16} r="1.4" fill={BOLLA} style={{ animationDuration: '2.9s', animationDelay: '0.9s' }} />
          </g>
          {/* La schiuma, col bordo basso a bolle */}
          <rect x="30" y={birraY - schiumaAlta} width="140" height={schiumaAlta} fill={SCHIUMA} />
          <circle cx="72" cy={birraY} r="6" fill={SCHIUMA} />
          <circle cx="92" cy={birraY + 2} r="7" fill={SCHIUMA} />
          <circle cx="113" cy={birraY} r="6" fill={SCHIUMA} />
          <circle cx="130" cy={birraY + 1} r="5" fill={SCHIUMA} />
        </g>
      )}

      {/* Schiuma che deborda quando trabocca */}
      {trabocco && (
        <g>
          <ellipse cx="100" cy={orloCy} rx={orloRx + 6} ry="11" fill={SCHIUMA} stroke={VETRO} strokeWidth="2" />
          <path
            d={`M${100 - orloRx} ${orloCy + 6} v22`}
            stroke={SCHIUMA}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d={`M${100 + orloRx - 4} ${orloCy + 6} v30`}
            stroke={SCHIUMA}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="82" cy={orloCy - 10} r="5" fill={SCHIUMA} />
          <circle cx="116" cy={orloCy - 12} r="4" fill={SCHIUMA} />
        </g>
      )}

      {/* Il vetro, sopra tutto */}
      <path d={bicchiere.contorno} fill="none" stroke={VETRO} strokeWidth="3" strokeLinecap="round" />
      {!trabocco && (
        <ellipse cx="100" cy={orloCy} rx={orloRx} ry="6" fill="none" stroke={VETRO} strokeWidth="2.5" />
      )}
      {/* Riflesso del vetro */}
      <line
        x1={100 - orloRx * 0.62}
        y1={cimaY + 8}
        x2={100 - orloRx * 0.45}
        y2={fondoY - 24}
        stroke="#fffdf7"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

type Fase = 'attesa' | 'gioco' | 'verdetto' | 'pausa' | 'fine' | 'inviato'

export function SpillataPerfetta({ token }: { token: string }) {
  const router = useRouter()
  const [inviando, avviaInvio] = useTransition()

  const [fase, setFase] = useState<Fase>('attesa')
  const [pinta, setPinta] = useState(1)
  const [punti, setPunti] = useState(0)
  const [livello, setLivello] = useState(0)
  const [spillando, setSpillando] = useState(false)
  const [trabocco, setTrabocco] = useState(false)
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
    ultimoT: 0,
    rafId: 0,
    timeoutId: 0,
    inizioPartita: 0,
  })

  const cambiaFase = useCallback((nuova: Fase) => {
    ref.current.fase = nuova
    setFase(nuova)
  }, [])

  const gameOver = useCallback(
    (motivo: string) => {
      const s = ref.current
      s.spillando = false
      setSpillando(false)
      cancelAnimationFrame(s.rafId)
      cambiaFase('fine')
      setMessaggio(motivo)
      setAnnuncio(`${motivo} Punteggio finale: ${s.punti}.`)
      setLivello(s.livello)
    },
    [cambiaFase]
  )

  // Il loop si auto-richiama passando da una ref: niente auto-riferimento
  // dentro useCallback, e ogni frame usa sempre la versione più recente.
  const tickRef = useRef<(t: number) => void>(() => {})
  const tick = useCallback(
    (t: number) => {
      const s = ref.current
      if (s.fase !== 'gioco' || !s.spillando) return
      const dt = Math.min(0.1, (t - s.ultimoT) / 1000)
      s.ultimoT = t
      s.livello += velocitaPerPinta(s.pinta) * dt
      if (s.livello >= PINTA.altezza) {
        s.livello = PINTA.altezza
        setTrabocco(true)
        gameOver('Traboccata!')
        return
      }
      setLivello(s.livello)
      s.rafId = requestAnimationFrame((x) => tickRef.current(x))
    },
    [gameOver]
  )
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  const avviaPartita = useCallback(() => {
    ref.current.inizioPartita = Date.now()
    ref.current.livello = 0
    setLivello(0)
    cambiaFase('gioco')
  }, [cambiaFase])

  const iniziaSpillata = useCallback(() => {
    const s = ref.current
    if (s.fase === 'pausa') cambiaFase('gioco')
    if (s.fase !== 'gioco' || s.spillando) return
    s.spillando = true
    setSpillando(true)
    s.ultimoT = performance.now()
    s.rafId = requestAnimationFrame(tick)
  }, [cambiaFase, tick])

  const fineSpillata = useCallback(() => {
    const s = ref.current
    if (s.fase !== 'gioco' || !s.spillando) return
    s.spillando = false
    setSpillando(false)
    cancelAnimationFrame(s.rafId)

    const zona = zonaPerPinta(s.pinta, PINTA.altezza)
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

    s.timeoutId = window.setTimeout(() => {
      s.pinta += 1
      s.livello = 0
      setPinta(s.pinta)
      setLivello(0)
      setMessaggio('')
      cambiaFase('gioco')
    }, 800)
  }, [cambiaFase, gameOver])

  const rigioca = useCallback(() => {
    const s = ref.current
    window.clearTimeout(s.timeoutId)
    s.pinta = 1
    s.punti = 0
    s.livello = 0
    s.spillando = false
    setPinta(1)
    setPunti(0)
    setLivello(0)
    setSpillando(false)
    setTrabocco(false)
    setMessaggio('')
    setSigla('')
    setPosizione(null)
    setErroreInvio('')
    cambiaFase('attesa')
  }, [cambiaFase])

  // Rilascio anche fuori dall'area di gioco; pausa quando la pagina sparisce.
  useEffect(() => {
    const suRilascio = () => fineSpillata()
    const suVisibilita = () => {
      const s = ref.current
      if (document.hidden && s.fase === 'gioco') {
        s.spillando = false
        setSpillando(false)
        cancelAnimationFrame(s.rafId)
        cambiaFase('pausa')
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
  }, [cambiaFase, fineSpillata])

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

  const zona = zonaPerPinta(pinta, PINTA.altezza)
  const inPartita = fase === 'gioco' || fase === 'verdetto' || fase === 'pausa'

  // In attesa si mostra una pinta servita a regola d'arte.
  const zonaIniziale = zonaPerPinta(1, PINTA.altezza)

  return (
    <div className="border-ottone/50 bg-pergamena mx-auto max-w-md rounded border-2 p-4">
      <p aria-live="polite" className="sr-only">
        {annuncio}
      </p>

      {fase === 'attesa' && (
        <div className="text-center">
          <BicchiereSvg
            bicchiere={PINTA}
            livello={(zonaIniziale.bassa + zonaIniziale.alta) / 2}
            spillando={false}
            trabocco={false}
            zona={zonaIniziale}
          />
          <p className="mt-3">
            Tieni premuto per spillare, lascia andare quando la birra è nella fascia dorata. Se
            trabocca o resta corta, la serata finisce lì.
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
            Pinta {pinta} · Punti {punti}
          </p>
          <BicchiereSvg
            bicchiere={PINTA}
            livello={livello}
            spillando={spillando}
            trabocco={trabocco}
            zona={zona}
          />
          <p className="min-h-6">
            {fase === 'pausa' ? 'In pausa: tieni premuto per riprendere.' : messaggio || ' '}
          </p>
        </div>
      )}

      {(fase === 'fine' || fase === 'inviato') && (
        <div className="text-center">
          <BicchiereSvg
            bicchiere={PINTA}
            livello={livello}
            spillando={false}
            trabocco={trabocco}
            zona={zona}
          />
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
