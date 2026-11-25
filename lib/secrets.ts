import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export function chiave(directory: string, purpose: 'app' | 'backup') {
  const configured = process.env[purpose === 'app' ? 'APP_ENCRYPTION_KEY' : 'BACKUP_ENCRYPTION_KEY']
  if (configured) {
    if (!/^[a-fA-F0-9]{64}$/.test(configured)) throw new Error('La chiave di cifratura deve contenere 64 caratteri esadecimali.')
    return Buffer.from(configured, 'hex')
  }
  const folder = path.join(directory, '.keys')
  fs.mkdirSync(folder, { recursive: true, mode: 0o700 })
  const file = path.join(folder, `${purpose}.key`)
  try { fs.writeFileSync(file, crypto.randomBytes(32).toString('hex'), { flag: 'wx', mode: 0o600 }) }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error }
  const value = fs.readFileSync(file, 'utf8').trim()
  if (!/^[a-f0-9]{64}$/.test(value)) throw new Error('Chiave di cifratura non valida')
  return Buffer.from(value, 'hex')
}
export function cifraSegreto(value: string, key: Buffer) {
  if (!value) return ''
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return ['enc','v1',iv.toString('hex'),cipher.getAuthTag().toString('hex'),data.toString('base64')].join(':')
}
export function decifraSegreto(value: string, key: Buffer) {
  if (!value) return ''
  const [scheme,version,iv,tag,data] = value.split(':')
  if (scheme !== 'enc' || version !== 'v1') throw new Error('Segreto non cifrato')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv,'hex'))
  decipher.setAuthTag(Buffer.from(tag,'hex'))
  return Buffer.concat([decipher.update(Buffer.from(data,'base64')),decipher.final()]).toString('utf8')
}
