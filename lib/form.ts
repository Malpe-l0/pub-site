// Validazione condivisa: i controlli HTML non sono una barriera lato server.
export function testo(formData: FormData, nome: string, max = 5000): string {
  const value = formData.get(nome)
  if (value !== null && typeof value !== 'string') throw new Error('Campo non valido')
  const text = (value || '').trim()
  if (text.length > max) throw new Error('Testo troppo lungo')
  return text
}
export function numero(formData: FormData, nome: string): number {
  const value = testo(formData, nome, 16)
  const n = value === '' ? 0 : Number(value)
  if (!Number.isSafeInteger(n) || n < 0 || n > 1000000000) throw new Error('Numero non valido')
  return n
}
export function prezzo(formData: FormData): number {
  const value = testo(formData, 'prezzo', 16)
  if (!/^\d{1,6}([.,]\d{1,2})?$/.test(value)) throw new Error('Prezzo non valido')
  return Math.round(Number(value.replace(',', '.')) * 100)
}
export function urlSicuro(value: string): string {
  if (!value) return ''
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || value.length > 2048) throw new Error('Usa un URL HTTPS valido')
  return url.href
}
export function dataValida(value: string, conOra = false) {
  if (!value) return null
  const pattern = conOra ? /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/ : /^\d{4}-\d{2}-\d{2}$/
  if (!pattern.test(value)) throw new Error('Data non valida')
  const d = new Date(value + (conOra ? ':00Z' : 'T00:00:00Z'))
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, conOra ? 16 : 10) !== value) throw new Error('Data non valida')
  return value
}
