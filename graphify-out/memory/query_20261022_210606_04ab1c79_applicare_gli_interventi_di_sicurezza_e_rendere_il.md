---
type: "implementation"
date: "2026-10-22T21:06:06.544675+00:00"
question: "Applicare gli interventi di sicurezza e rendere il sito riutilizzabile per altri locali"
contributor: "graphify"
outcome: "useful"
source_nodes: ["lib/auth.ts", "lib/security.ts", "lib/database.ts", "lib/backup.ts", "lib/media.ts", "lib/branding.ts"]
---

# Q: Applicare gli interventi di sicurezza e rendere il sito riutilizzabile per altri locali

## Answer

Implementati account owner/editor, scrypt, limiti di login persistenti e sessioni revocabili in lib/security.ts e lib/auth.ts. I vecchi cookie non sono accettati; logout, cambio password e disabilitazione revocano gli accessi. Nuove pagine /admin/account e /admin/aspetto. Migrazioni transazionali con gestione degli avvii concorrenti in lib/migrations.ts e lib/database.ts. Upload limitati e rasterizzati in WebP, sostituzioni che conservano i file precedenti in caso di errore; cancellazione differita e verifica dei riferimenti. Backup SQLite consistenti cifrati AES-GCM, compatibili con lo schema precedente, ripristino verificato in directory nuove e revoca delle sessioni ripristinate. Worker con backup giornaliero, conservazione, pulizia e rinnovo/sync Instagram indipendenti; token cifrati. Personalizzazione logo, colore accessibile, font, foto principale, testi IT/EN, birre e sezioni. CLI per inizializzare clienti vuoti e recuperare accessi. Docker/Compose e documentazione per istanze separate. Dipendenze aggiornate: audit produzione zero; restano 5 segnalazioni solo sviluppo nella catena ESLint/braces senza fix compatibile. Verifiche: 19 test passati, typecheck e lint passati, build Webpack passata, flussi HTTP completi su database temporaneo passati, backup/ripristino CLI e validazione Compose passati. Turbopack bloccato dall’ambiente nei processi CSS; fallback Webpack verificato. Database reale non modificato dalle prove, migrazioni applicate al prossimo avvio. Hosting, storage remoto, DNS/TLS e credenziali Meta restano configurazioni operative da eseguire nell’ambiente scelto. Codice AST aggiornato con graphify update .

## Outcome

- Signal: useful

## Source Nodes

- lib/auth.ts
- lib/security.ts
- lib/database.ts
- lib/backup.ts
- lib/media.ts
- lib/branding.ts