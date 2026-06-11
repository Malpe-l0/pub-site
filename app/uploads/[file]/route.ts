import path from 'node:path'
import fs from 'node:fs/promises'
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
  if (file !== path.basename(file) || !tipo) {
    return new Response('Non trovato', { status: 404 })
  }

  try {
    const dati = await fs.readFile(path.join(UPLOADS_DIR, file))
    return new Response(new Uint8Array(dati), {
      headers: {
        'Content-Type': tipo,
        // I nomi file sono unici per ogni upload: cache aggressiva senza rischi.
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Gli SVG possono contenere script: aperti direttamente non devono eseguirli.
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
      },
    })
  } catch {
    return new Response('Non trovato', { status: 404 })
  }
}
