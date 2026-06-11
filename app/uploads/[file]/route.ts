import path from 'node:path'
import fs from 'node:fs/promises'
import { UPLOADS_DIR } from '@/lib/db'

// Serve le foto caricate dal pannello admin (salvate in DATA_DIR/uploads,
// fuori da public/ che viene congelato alla build).
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params

  // Solo nomi file generati da noi: niente path traversal.
  if (file !== path.basename(file) || !file.endsWith('.webp')) {
    return new Response('Non trovato', { status: 404 })
  }

  try {
    const dati = await fs.readFile(path.join(UPLOADS_DIR, file))
    return new Response(new Uint8Array(dati), {
      headers: {
        'Content-Type': 'image/webp',
        // I nomi file sono unici per ogni upload: cache aggressiva senza rischi.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Non trovato', { status: 404 })
  }
}
