import Image from 'next/image'
import type { Birra } from '@/lib/branding'

export function MuroBirre({ birre }: { birre: Birra[] }) {
  return <ul className="pub-beers">{birre.map((b) => (
    <li key={b.nome}>
      {b.logo && <div className="pub-beer-logo"><Image src={b.logo} alt="" loading="lazy" width={140} height={90} /></div>}
      <h3>{b.nome}</h3><p>{b.stile}</p>
    </li>
  ))}</ul>
}
