'use client'

import { useState } from 'react'

// ponytail: widget TEMPORANEO per provare le palette dal sito stesso. Scrive le
// CSS variables su :root a runtime (vincono su @theme). Nessuna persistenza: la
// scelta resta finché non si ricarica la pagina. Rimuovere <AnteprimaPalette />
// dal layout del sito una volta decisa la direzione.

const CHIAVI = [
  '--color-espresso',
  '--color-espresso-2',
  '--color-espresso-3',
  '--color-nerocaldo',
  '--color-ambra',
  '--color-ambra-hover',
  '--color-ambra-ink',
] as const

type Palette = { nome: string; campione: string; vars: Record<string, string> | null }

const PALETTE: Palette[] = [
  { nome: 'Black Friar', campione: '#1e6240', vars: null },
  {
    nome: 'Verde bottiglia',
    campione: '#14402a',
    vars: {
      '--color-espresso': '#14402a',
      '--color-espresso-2': '#14402a',
      '--color-espresso-3': '#0f2e1f',
      '--color-nerocaldo': '#112e20',
      '--color-ambra': '#eab325',
      '--color-ambra-hover': '#f4c54a',
      '--color-ambra-ink': '#f2cb5c',
    },
  },
  {
    nome: 'Chesterfield',
    campione: '#4a191d',
    vars: {
      '--color-espresso': '#4a191d',
      '--color-espresso-2': '#4a191d',
      '--color-espresso-3': '#33171a',
      '--color-nerocaldo': '#3a1518',
      '--color-ambra': '#e3b04b',
      '--color-ambra-hover': '#eec06a',
      '--color-ambra-ink': '#f0cf7e',
    },
  },
  {
    nome: 'Porter',
    campione: '#22303d',
    vars: {
      '--color-espresso': '#22303d',
      '--color-espresso-2': '#22303d',
      '--color-espresso-3': '#1a2530',
      '--color-nerocaldo': '#1c2833',
      '--color-ambra': '#e0a03f',
      '--color-ambra-hover': '#ecb45f',
      '--color-ambra-ink': '#eec687',
    },
  },
  {
    nome: 'Tabacco',
    campione: '#46311f',
    vars: {
      '--color-espresso': '#46311f',
      '--color-espresso-2': '#46311f',
      '--color-espresso-3': '#332417',
      '--color-nerocaldo': '#3a2a1e',
      '--color-ambra': '#eab325',
      '--color-ambra-hover': '#f4c54a',
      '--color-ambra-ink': '#f2cb5c',
    },
  },
]

export function AnteprimaPalette() {
  const [attiva, setAttiva] = useState('Black Friar')
  const [aperto, setAperto] = useState(true)

  const applica = (p: Palette) => {
    CHIAVI.forEach((k) => document.documentElement.style.removeProperty(k))
    if (p.vars) Object.entries(p.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v))
    setAttiva(p.nome)
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 50,
        background: 'rgba(17,17,17,0.94)',
        border: '1px solid #eab325',
        color: '#f4eedd',
        font: '12px system-ui, sans-serif',
        maxWidth: 220,
      }}
    >
      <button
        type="button"
        onClick={() => setAperto((a) => !a)}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '9px 12px',
          background: 'transparent',
          color: '#eab325',
          border: 0,
          cursor: 'pointer',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontSize: 10,
        }}
        aria-expanded={aperto}
      >
        <span>Anteprima palette</span>
        <span aria-hidden>{aperto ? '−' : '+'}</span>
      </button>

      {aperto && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px 8px' }}>
          {PALETTE.map((p) => {
            const sel = p.nome === attiva
            return (
              <button
                key={p.nome}
                type="button"
                onClick={() => applica(p)}
                aria-pressed={sel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  minHeight: 34,
                  padding: '6px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: sel ? 'rgba(234,179,37,0.16)' : 'transparent',
                  color: '#f4eedd',
                  border: sel ? '1px solid #eab325' : '1px solid #3a3a3a',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    background: p.campione,
                    border: '1px solid rgba(255,255,255,0.35)',
                  }}
                />
                {p.nome}
              </button>
            )
          })}
          <p style={{ margin: '6px 2px 0', color: '#a99f8c', fontSize: 10, lineHeight: 1.5 }}>
            Solo anteprima. Si azzera al ricaricamento.
          </p>
        </div>
      )}
    </div>
  )
}
