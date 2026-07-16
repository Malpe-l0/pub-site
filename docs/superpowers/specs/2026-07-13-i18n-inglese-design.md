# Sito bilingue IT/EN — design

Data: 2026-07-13 · Stato: approvato in chat

## Obiettivo

Versione inglese del sito pubblico per utenti con dispositivo non italiano.
Si traduce **solo l'interfaccia** (nav, titoli, footer, pagina dove, stati
vuoti, metadata). I contenuti dal pannello admin (menu, eventi, popup,
descrizione) restano in italiano. Il pannello admin non cambia.

## URL e routing

- Italiano: URL invariati (`/`, `/menu`, `/galleria`, `/dove`) — QR e link
  esistenti continuano a funzionare. Il proxy li riscrive internamente a
  `/it/...` (rewrite, invisibile).
- Inglese: prefisso `/en` (`/en`, `/en/menu`, ...), servito nativamente da
  `app/[lang]/`.
- Le pagine pubbliche si spostano da `app/(sito)/` a `app/[lang]/(sito)/`.
  `lang ∈ {it, en}`, validato nel layout (altrimenti 404).

## Rilevamento lingua (`proxy.ts`, matcher solo su `/`, `/menu`, `/galleria`, `/dove`)

1. Cookie `lingua` (scelta esplicita del toggle) → vince sempre.
2. Altrimenti `Accept-Language`: se presente e senza italiano → redirect a
   `/en/...`.
3. Header assente o con italiano → italiano (default; i bot senza header
   vedono l'italiano).

## Toggle IT/EN

In `NavTaproom` (desktop e mobile): salva il cookie `lingua` (1 anno, non
httpOnly) e naviga all'URL equivalente nell'altra lingua.

## Traduzioni

`lib/dizionario.ts`: due oggetti tipizzati (`en: typeof it`), caricati
server-side, passati come props ai client component. Interpolazioni come
funzioni. Prezzi con `Intl.NumberFormat` nella locale giusta.

## Layout radice

`app/layout.tsx` si sdoppia (pattern multi-root-layout):
- `app/[lang]/layout.tsx` — pubblico, `<html lang>` dinamico, hreflang.
- `app/admin/layout.tsx` — admin, `<html lang="it">`.
Font condivisi in `app/fonts.ts`.

## SEO

`<html lang>` corretto; `alternates.languages` (hreflang) per pagina.

## Verifica

Browser: `/menu` invariato in italiano; device EN → redirect `/en/menu`;
toggle nei due sensi con cookie che persiste; admin intatto.
