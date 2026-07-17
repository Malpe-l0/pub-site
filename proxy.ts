import { NextResponse, type NextRequest } from 'next/server'

const ANNO = 60 * 60 * 24 * 365

/**
 * Lingua del sito pubblico. L'italiano resta sugli URL puliti (/menu, /dove:
 * QR e link esistenti invariati) e viene riscritto internamente a /it/...;
 * l'inglese vive su /en/... e arriva qui solo come redirect iniziale.
 *
 * La scelta dal toggle arriva come `?lingua=it|en`: il server scrive il cookie
 * e reindirizza all'URL pulito. Farlo qui (non con document.cookie lato client)
 * è affidabile anche sui browser mobile che bloccano i cookie da JavaScript.
 * Il cookie `lingua` vince sempre sull'header Accept-Language del dispositivo.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl

  // Scelta esplicita dal toggle → salva cookie, poi redirect all'URL pulito.
  const scelta = url.searchParams.get('lingua')
  if (scelta === 'it' || scelta === 'en') {
    url.searchParams.delete('lingua')
    if (scelta === 'en') url.pathname = url.pathname === '/' ? '/en' : `/en${url.pathname}`
    const res = NextResponse.redirect(url)
    res.cookies.set('lingua', scelta, { path: '/', maxAge: ANNO, sameSite: 'lax' })
    return res
  }

  const cookie = req.cookies.get('lingua')?.value
  const lingueDispositivo = (req.headers.get('accept-language') ?? '')
    .split(',')
    .map((l) => l.split(';')[0].trim().toLowerCase())
    .filter(Boolean)
  // Header assente (bot, curl) → italiano.
  const vuoleInglese = cookie
    ? cookie === 'en'
    : lingueDispositivo.length > 0 && !lingueDispositivo.some((l) => l === 'it' || l.startsWith('it-'))

  if (vuoleInglese) {
    url.pathname = url.pathname === '/' ? '/en' : `/en${url.pathname}`
    return NextResponse.redirect(url)
  }
  url.pathname = url.pathname === '/' ? '/it' : `/it${url.pathname}`
  return NextResponse.rewrite(url)
}

// Solo le pagine pubbliche italiane: /en/* è servito nativamente da app/[lang],
// admin/uploads/asset non c'entrano con la lingua. Il toggle punta sempre a uno
// di questi percorsi (senza prefisso) col parametro ?lingua, così passa di qui.
export const config = {
  matcher: ['/', '/menu', '/galleria', '/dove'],
}
