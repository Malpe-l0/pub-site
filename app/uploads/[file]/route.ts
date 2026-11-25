import path from 'node:path'
import fs from 'node:fs/promises'
import { constants } from 'node:fs'
import { nomeFileSicuro } from '@/lib/media'
import { UPLOADS_DIR } from '@/lib/db'

const TIPI: Record<string, string> = {
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

// Serve le foto e i loghi caricati dal pannello admin (salvati in
// DATA_DIR/uploads, fuori da public/ che viene congelato alla build).
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const estensione = path.extname(file).toLowerCase()
  const tipo = TIPI[estensione]

  // Solo nomi file generati da noi: niente path traversal, niente altri tipi.
  if (file !== path.basename(file) || !tipo || !nomeFileSicuro(file)) {
    return new Response('Non trovato', { status: 404 })
  }

  try {
    const handle = await fs.open(path.join(UPLOADS_DIR, file), constants.O_RDONLY | constants.O_NOFOLLOW)
    let dati: Buffer
    try { dati = await handle.readFile() } finally { await handle.close() }
    return new Response(new Uint8Array(dati), {
      headers: {
        'Content-Type': tipo,
        'X-Content-Type-Options': 'nosniff',
        // I nomi file sono unici per ogni upload: cache aggressiva senza rischi.
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Gli SVG possono contenere script: aperti direttamente non devono eseguirli.
        'Content-Security-Policy': "sandbox; default-src 'none'; style-src 'unsafe-inline'",
      },
    })
  } catch {
    return new Response('Non trovato', { status: 404 })
  }
}
