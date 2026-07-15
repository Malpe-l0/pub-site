import { NextResponse, type NextRequest } from 'next/server'

/**
 * Lingua del sito pubblico. L'italiano resta sugli URL puliti (/menu, /dove:
 * QR e link esistenti invariati) e viene riscritto internamente a /it/...;
 * l'inglese vive su /en/... e arriva qui solo come redirect iniziale.
 * Il cookie `lingua` (toggle in nav) vince sempre sull'header del dispositivo.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl
  const scelta = req.cookies.get('lingua')?.value
  const lingueDispositivo = (req.headers.get('accept-language') ?? '')
    .split(',')
    .map((l) => l.split(';')[0].trim().toLowerCase())
    .filter(Boolean)
  // Header assente (bot, curl) → italiano.
  const vuoleInglese = scelta
    ? scelta === 'en'
    : lingueDispositivo.length > 0 && !lingueDispositivo.some((l) => l === 'it' || l.startsWith('it-'))

  if (vuoleInglese) {
    url.pathname = url.pathname === '/' ? '/en' : `/en${url.pathname}`
    return NextResponse.redirect(url)
  }
  url.pathname = url.pathname === '/' ? '/it' : `/it${url.pathname}`
  return NextResponse.rewrite(url)
}

// Solo le pagine pubbliche italiane: /en/* è servito nativamente da app/[lang],
// admin/uploads/asset non c'entrano con la lingua.
export const config = {
  matcher: ['/', '/menu', '/galleria', '/dove'],
}
