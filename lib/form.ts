// Lettura dei campi di un FormData nelle server action del pannello.

export function testo(formData: FormData, nome: string): string {
  return String(formData.get(nome) ?? '').trim()
}

export function numero(formData: FormData, nome: string): number {
  const n = Number(formData.get(nome))
  return Number.isFinite(n) ? n : 0
}
