'use client'
import {useFormStatus} from 'react-dom'
export function Submit({children,pending='Salvataggio…',className='',disabled=false}:{children:React.ReactNode;pending?:string;className?:string;disabled?:boolean}){
  const status=useFormStatus()
  return <button className={className} disabled={disabled||status.pending} aria-busy={status.pending}>{status.pending?pending:children}</button>
}
