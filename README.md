# Sito per locali con pannello di gestione

Next.js 16, React 19, SQLite e immagini su disco. La base di codice è comune;
ogni cliente usa un'istanza, un dominio, un database e chiavi propri.

## Sviluppo e primo accesso

Serve Node >=22.18 (consigliato Node 24).

```sh
npm ci
cp .env.local.example .env.local
npm run dev
```

Il comando avvia insieme Next.js e il worker per backup e Instagram. Per usare
Webpack in locale: `npm run dev -- --webpack`. Arrestando il comando si fermano
entrambi i processi. Il worker usa lo stesso DATA_DIR del sito.

Compila `ADMIN_USERNAME` e `ADMIN_PASSWORD` (12–128 caratteri) prima del primo
accesso su `/admin`. L'account titolare viene creato una sola volta e la
password è salvata con scrypt. Dopo la creazione rimuovi `ADMIN_PASSWORD`
dall'ambiente: ulteriori cambi alla variabile non cambiano gli account.
I vecchi cookie HMAC non sono più accettati: occorre un nuovo accesso.

Il pannello offre contenuti, aspetto, account e registro delle operazioni.
Il titolare può creare collaboratori, disabilitare account, reimpostare
password e revocare sessioni. I collaboratori modificano contenuti; identità,
credenziali esterne e account restano riservati ai titolari.

## Recupero dell'accesso

Dalla console del server, con lo stesso DATA_DIR del sito:

```sh
npm run admin:reset -- admin
```

La password viene richiesta con digitazione nascosta; non passarla negli
argomenti della shell. L'operazione revoca tutte le sessioni dell'account e
azzera i limiti di accesso. Un altro titolare può anche reimpostarla dal pannello.
Non è presente un recupero via email: nessun servizio email è richiesto.

## Dati e aggiornamenti

`DATA_DIR` contiene `pub.db`, `uploads/` e, se non fornite tramite ambiente,
le chiavi in `.keys/`. Deve risiedere su disco persistente locale al server.
Non condividere la stessa directory fra clienti; non usarla su filesystem di
rete per condividere SQLite WAL fra host diversi.

Le migrazioni in `lib/migrations.ts` sono numerate e transazionali. Si applicano
all'avvio mantenendo i dati precedenti; un errore blocca l'avvio e viene
segnalato. Prima di aggiornare un sito attivo esegui e verifica un backup.
Le immagini rimosse sono eliminate fisicamente dopo 48 ore, se non più usate:
questa finestra protegge i backup in corso e i salvataggi falliti.

## Backup cifrati e ripristino

```sh
npm run backup
npm run backup:restore -- /percorso/backup/pub-... /percorso/nuovo-ripristino
```

`BACKUP_DIR` è la destinazione (default `./backups`). Ogni backup usa uno
snapshot SQLite con la Backup API e copia i file referenziati nello snapshot.
Database, immagini e manifest sono cifrati separatamente con AES-256-GCM;
il ripristino verifica autenticità, hash dei file e integrità SQLite.

Il ripristino accetta solo una directory nuova e revoca le sessioni presenti
nel database salvato. Non sostituisce il sito in funzione. Verifica il sito
ripristinato prima di modificare il DATA_DIR dell'applicazione.

Conserva **separatamente e fuori dal server** le chiavi app e backup. Se non
configuri `APP_ENCRYPTION_KEY` e `BACKUP_ENCRYPTION_KEY` (64 caratteri hex), sono
generate rispettivamente in `.keys/app.key` e `.keys/backup.key`. Le chiavi
non sono incluse negli archivi. Il ripristino richiede la chiave backup
originale; Instagram richiede anche quella app originale. Per ripristinare su
un altro server, imposta tali chiavi nell'ambiente del processo di recupero.
Non sostituire una chiave con un valore casuale: i vecchi dati non sarebbero
più leggibili.

La cifratura non replica i backup: imposta BACKUP_DIR su una destinazione
separata o sincronizzane gli archivi cifrati verso il tuo storage remoto.
Prova periodicamente un ripristino in una directory vuota.

## Manutenzione automatica

```sh
npm run maintenance
npm run maintenance -- --watch
```

Un'esecuzione produce il backup giornaliero, conserva 30 giorni di archivi,
pulisce file non più usati dopo 48 ore e registri dopo 180 giorni, rinnova il
token Instagram quando la scadenza è vicina e sincronizza le foto ogni 6 ore.
La modalità `--watch` esegue subito il lavoro e lo ripete ogni ora. È presente
una lease nel database per evitare worker sovrapposti. Gli errori producono un
codice di uscita diverso da zero in modalità singola e vengono riprovati dal
worker. Monitora il worker e lo spazio disponibile.

## Instagram e galleria

Il pannello separa **Galleria** (selezione e caricamento delle immagini) da
**Instagram** (account, autorizzazione e sincronizzazione). In Galleria puoi
scegliere solo foto manuali, solo Instagram, entrambe oppure la modalità
automatica: Instagram quando la cache contiene foto visibili, manuali altrimenti.
Un errore di rete conserva la cache: non attiva automaticamente il fallback.
Ogni foto Instagram può essere nascosta. Le didascalie sono conservate e
mostrate sul sito; i caroselli contribuiscono con una copertina. L'importazione
legge fino a quattro pagine per trovare nove immagini idonee. Puoi abilitare
le copertine dei video/Reel; nessun video viene riprodotto o scaricato.

### Collegamento guidato con Instagram Login

Chi installa il sito configura nell'ambiente server:

```dotenv
INSTAGRAM_APP_ID="ID dell'app Instagram"
INSTAGRAM_APP_SECRET="segreto dell'app Instagram"
INSTAGRAM_API_VERSION="versione supportata nell'app Meta"
INSTAGRAM_REDIRECT_URI="https://dominio-cliente.it/admin/instagram/callback"
```

1. Nell'app Meta abilita **Instagram API with Instagram Login** e configura
   l'URI di reindirizzamento esatto, incluso `/admin/instagram/callback`.
2. Usa un account Instagram Business o Creator. Questo flusso non richiede
   una Pagina Facebook collegata. Richiediamo soltanto `instagram_business_basic`
   per leggere il profilo e i media; nessun permesso per pubblicare o inviare messaggi.
3. Per account di clienti esterni ai ruoli di test, verifica e completa nel
   pannello Meta App Review, accesso ai permessi e gli altri requisiti richiesti
   per il tuo caso d'uso (ad esempio privacy e cancellazione dei dati).
4. Riavvia il sito e il worker dopo aver impostato l'ambiente. In Instagram
   premi **Collega Instagram**, autorizza e poi **Sincronizza ora**. Il worker
   esegue comunque l'importazione alla prima finestra utile.

Le credenziali non sono incluse nel repository. In produzione il callback
richiede HTTPS. Il dominio deve essere autorizzato in Meta: un test locale con
risposte simulate non certifica la configurazione o l'approvazione dell'app.
Riferimenti: [Instagram Login, Meta](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/)
e [raccolta ufficiale Meta](https://www.postman.com/meta/instagram/folder/6raa77c/instagram-api-with-instagram-login).

Lo state OAuth è casuale, monouso, scade dopo 10 minuti ed è associato al
browser e al titolare. Il codice è scambiato solo sul server per un token
esteso; la scadenza proviene da `expires_in` restituito da Meta. Prima del
salvataggio verifichiamo profilo e accesso ai media. I token sono cifrati nel
database e mai restituiti al pannello. Evita di registrare URL completi delle
richieste di scambio/rinnovo e query del callback nel proxy o nei log esterni.

Resta disponibile un modulo avanzato per un token manuale, verificato prima
del salvataggio. La sua scadenza iniziale resta sconosciuta, senza stimare
arbitrariamente altri 60 giorni. I vecchi token in chiaro vengono cifrati
alla lettura. La versione API deve essere scelta fra quelle supportate dalla
propria app Meta: non viene fissata a una versione storica nel codice.

**Ricollega o cambia account** sostituisce il collegamento soltanto dopo la
verifica. Se l'account cambia, la vecchia cache viene rimossa. **Scollega**
rimuove token e cache da questo sito; le foto manuali restano. La revoca
presso Meta si può effettuare dalle impostazioni Instagram dell'account.
Le eliminazioni fisiche sul disco rispettano la finestra di sicurezza di 48 ore;
eventuali backup cifrati seguono la loro retention e non vengono riscritti.

Il servizio rinnova l'autorizzazione entro i 14 giorni precedenti la scadenza,
con almeno un giorno fra rinnovi riusciti. Distingue errori di accesso,
permessi, limite richieste e rete, senza mostrare messaggi grezzi o segreti.
L'ultima sincronizzazione riuscita è distinta dall'ultimo tentativo. Una
sincronizzazione parziale non sostituisce la galleria e una richiesta avviata
prima dello scollegamento non può ripubblicare le vecchie immagini.

Il pannello segnala un worker non rilevato da oltre due ore, l'ultimo ciclo
completato ed eventuali problemi di backup/Instagram. In produzione il worker
è già incluso in Compose; fuori da Compose avvia `npm run maintenance -- --watch`
con supervisione del processo. Il pannello offre avvisi interni; non invia email.

## Creazione di un nuovo cliente

```sh
npm run site:init -- /directory/nuova "Nome attività"
```

Il comando rifiuta directory esistenti e crea un sito vuoto con chiavi nuove.
Configura DATA_DIR, crea il titolare con `admin:reset`, poi inserisci logo,
foto, colore, testi IT/EN, birre, sezioni, contatti e menu dal pannello.
Non duplicare il database, i file caricati o le chiavi di un altro cliente.
Usa release comuni della stessa base di codice per aggiornare i siti.

## Produzione con Docker

Sono forniti Dockerfile, `compose.yaml` e `deployment/Caddyfile`: applicazione,
worker e proxy HTTPS condividono i dati solo all'interno dello stack del cliente.

1. Crea `.env.production` con credenziali iniziali e chiavi specifiche del cliente.
2. In un `.env` per Compose configura SITE_ID univoco, SITE_DOMAIN e BACKUP_PATH.
   La directory backup deve essere scrivibile dall'UID 1000 del container.
3. Punta il DNS al server, libera le porte 80/443 ed esegui `docker compose up -d --build`.
4. Accedi, verifica i contenuti, il worker e un ripristino; rimuovi la password
   iniziale dall'ambiente dopo la creazione del titolare.

TRUST_PROXY=1 è corretto per il proxy fornito, che sovrascrive X-Real-IP.
Fuori da questo stack lascialo a 0, salvo un proxy equivalente. Non pubblicare
la porta dell'app direttamente. I cookie di produzione richiedono HTTPS.
Per più stack sullo stesso host usa un proxy HTTPS condiviso e collega ogni
app al suo dominio: più stack non possono occupare contemporaneamente le
stesse porte 80/443.

## Verifiche

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

I test usano solo database e file temporanei; coprono migrazioni, accessi,
revoca e scadenza sessioni, isolamento dei database, validazione, cifratura,
file corrotti e backup/ripristino. Configurazione DNS/TLS, storage remoto e
permessi Meta vanno verificati sull'hosting scelto.

### Prova HTTP facoltativa

`npm run test:integration` esegue richieste reali verso un server locale sulla
porta 3100, con `TEST_ADMIN_PASSWORD` nell’ambiente. Richiede un sito temporaneo
creato con nome esatto `Locale di verifica` e account `admin`. Crea un
collaboratore, modifica aspetto e password e verifica logout e limiti di login:
non usarlo con dati reali. Per ripeterlo, reimposta l’account nella fixture.

L’audit di produzione è pulito dopo l’aggiornamento. Restano segnalazioni di
sviluppo nella catena ESLint/fast-glob/braces, senza una correzione compatibile
a monte: non sono incluse nell’immagine runtime (`npm ci --omit=dev`).
Non usare `npm audit fix --force` per retrocedere Next/ESLint a versioni vecchie.
