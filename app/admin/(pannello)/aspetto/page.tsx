import { richiediAdmin } from '@/lib/auth'
import { getImpostazioni } from '@/lib/dati'
import { CAMPI_TESTO } from '@/lib/branding'
import { salvaAspetto } from './azioni'

export default async function Aspetto({ searchParams }: { searchParams: Promise<{ salvato?: string }> }) {
  await richiediAdmin('owner')
  const { branding: b } = getImpostazioni()
  const { salvato } = await searchParams
  return <><h1>Aspetto e testi</h1><p>Personalizza l’identità del locale. Le modifiche saranno visibili sul sito dopo il salvataggio.</p>
    {salvato && <p role="status">Personalizzazione salvata.</p>}
    <nav className="admin-anchor-nav" aria-label="Sezioni della personalizzazione"><a href="#identita">Identità</a><a href="#sezioni">Sezioni</a><a href="#testi">Testi</a><a href="#birre">Birre</a></nav>
    <form action={salvaAspetto}>
      <h2 id="identita">Identità del locale</h2><label>Colore principale<input name="colore" type="color" defaultValue={b.colore} required /></label>
      <p>Il colore viene adattato quando serve a mantenere leggibile il testo.</p><label>Carattere<select name="font" defaultValue={b.font}><option value="sans">Contemporaneo</option><option value="serif">Classico</option></select></label>
      <p>Immagini statiche fino a 8 MB; puoi sostituirne fino a 5 con un salvataggio.</p>
      {(['logo','hero'] as const).map(key => <div key={key} className="py-4">
        <label>{key === 'logo' ? 'Logo del locale' : 'Foto principale'}<input type="file" name={key} accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" /></label>
        {b[key] && <><img src={b[key]} alt={key === 'logo' ? 'Logo attuale' : 'Foto principale attuale'} className="my-2 max-h-32 max-w-full" /><label><input type="checkbox" name={`rimuovi${key[0].toUpperCase()}${key.slice(1)}`} /> Rimuovi immagine</label></>}
      </div>)}
      <label>Descrizione della foto principale<input name="heroAlt" defaultValue={b.heroAlt} maxLength={250} /></label>
      <h2 id="sezioni">Sezioni della pagina iniziale</h2>{Object.entries(b.sezioni).map(([key,value]) => <label key={key}><input type="checkbox" name={`sezione_${key}`} defaultChecked={value} /> {{birre:'Birre',menu:'Menu',galleria:'Galleria',eventi:'Eventi',servizi:'Servizi'}[key]}</label>)}
      <h2 id="testi">Testi del sito</h2><p>Lascia un campo vuoto per usare il testo predefinito. La presentazione italiana usa la descrizione nelle Impostazioni quando non la personalizzi qui.</p>
      {(['it','en'] as const).map(lang => <details key={lang} className="my-4"><summary>{lang === 'it' ? 'Italiano' : 'English'}</summary>{Object.entries(CAMPI_TESTO).map(([key,label]) => <label key={key}>{label}<textarea name={`${lang}_${key}`} defaultValue={b.testi[lang][key] || ''} rows={2} maxLength={5000} /></label>)}</details>)}
      <h2 id="birre">Selezione delle birre</h2><p>Lascia vuoto il nome per togliere una birra. I campi vuoti in fondo consentono di aggiungerne altre.</p>
      {Array.from({length:Math.min(24,b.birre.length+3)},(_,i) => <details key={i} className="admin-beer-editor"><summary>{b.birre[i]?.nome || `Aggiungi birra ${i+1}`}</summary><fieldset><legend>Birra {i+1}</legend>
        <label>Nome<input name={`birra_${i}_nome`} defaultValue={b.birre[i]?.nome || ''} maxLength={100} /></label>
        <label>Stile<input name={`birra_${i}_stile`} defaultValue={b.birre[i]?.stile || ''} maxLength={100} /></label>
        <label>Logo<input type="file" name={`birra_${i}`} accept="image/*" /></label>
        {b.birre[i]?.logo && <><img src={b.birre[i].logo} alt="Logo attuale" className="my-2 h-16 w-auto" /><label><input type="checkbox" name={`rimuoviBirra_${i}`} /> Rimuovi logo</label></>}
      </fieldset></details>)}<button>Salva personalizzazione</button>
    </form></>
}
