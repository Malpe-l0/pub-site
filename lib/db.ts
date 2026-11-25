import path from 'node:path'
import { apriDatabase } from './database.ts'
import type Database from 'better-sqlite3'

// Una directory e un processo applicativo separati per ciascuna attività.
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'))
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const globale = globalThis as unknown as { __db?: Database.Database }
export const db = globale.__db ?? (globale.__db = apriDatabase(DATA_DIR))
