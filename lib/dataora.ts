// Le date/ore di eventi e pop-up sono salvate come stringhe "naive"
// (YYYY-MM-DD e YYYY-MM-DDTHH:MM) intese come ora italiana. Formattazione e
// confronti passano da qui, così il fuso orario del server non conta.

/** Data odierna in Italia, formato YYYY-MM-DD (confrontabile come stringa). */
export function oggiInItalia(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date())
}

/** Data e ora attuali in Italia, formato YYYY-MM-DDTHH:MM. */
export function adessoInItalia(): string {
  const parti = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const p = Object.fromEntries(parti.map(({ type, value }) => [type, value]))
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

/** "2026-06-10T21:30" → "mercoledì 10 giugno 2026, 21:30". */
export function formattaDataOra(naive: string): string {
  const [data, ora] = naive.split('T')
  const [anno, mese, giorno] = data.split('-').map(Number)
  const [ore, minuti] = (ora ?? '00:00').split(':').map(Number)
  // Costruita e formattata in UTC: nessuna dipendenza dal fuso del server.
  const d = new Date(Date.UTC(anno, mese - 1, giorno, ore, minuti))
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(d)
}
