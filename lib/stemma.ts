import fs from 'node:fs'
import path from 'node:path'

/**
 * Lo stemma è opzionale: se Gabriele non ha ancora messo public/stemma.png
 * il sito mostra solo il nome, senza errori. Controllo a ogni richiesta
 * (le pagine sono dinamiche), così basta aggiungere il file senza riavviare.
 */
export function stemmaDisponibile(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', 'stemma.png'))
}
