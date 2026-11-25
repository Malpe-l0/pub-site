import { spawn } from 'node:child_process'
// Un solo comando avvia sito e manutenzione sullo stesso DATA_DIR.
const children=[
  spawn(process.execPath,['node_modules/next/dist/bin/next','dev',...process.argv.slice(2)],{stdio:'inherit',env:process.env}),
  spawn(process.execPath,['scripts/maintenance.ts','--watch'],{stdio:'inherit',env:process.env}),
]
let closing=false
function stop(code:number) {
  if(closing)return
  closing=true
  for(const child of children)child.kill('SIGTERM')
  process.exitCode=code
}
process.on('SIGINT',()=>stop(0));process.on('SIGTERM',()=>stop(0))
for(const child of children){child.on('error',()=>stop(1));child.on('exit',code=>stop(code||0))}
