import { readFileSync } from 'node:fs'
import mysql, { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'

type DbUser = {
  id: number
  name: string
  email: string
  password_hash: string
}

function resolveDbPassword(): string {
  const inlinePassword = process.env.DB_PASSWORD
  if (inlinePassword) {
    return inlinePassword
  }

  const passwordFile = process.env.DB_PASSWORD_FILE
  if (passwordFile) {
    return readFileSync(passwordFile, 'utf-8').trim()
  }

  return 'password'
}

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'database',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'finus_app',
  password: resolveDbPassword(),
  database: process.env.DB_NAME ?? 'finus',
  waitForConnections: true,
  connectionLimit: 10,
})

const INIT_RETRIES = 30
const INIT_DELAY_MS = 1000

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let initPromise: Promise<void> | null = null

async function initializeSchema() {
  await pool.execute(`
CREATE TABLE IF NOT EXISTS auth_user (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`)
}

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      let lastError: unknown = null

      for (let attempt = 1; attempt <= INIT_RETRIES; attempt += 1) {
        try {
          await initializeSchema()
          return
        } catch (error) {
          lastError = error
          if (attempt < INIT_RETRIES) {
            await wait(INIT_DELAY_MS)
          }
        }
      }

      throw lastError
    })()
  }

  await initPromise
}

async function findUserByEmail(email: string): Promise<DbUser | null> {
  await ensureInitialized()

  const [rows] = await pool.execute<(DbUser & RowDataPacket)[]>(
    'SELECT id, name, email, password_hash FROM auth_user WHERE email = ? LIMIT 1',
    [email]
  )

  return rows[0] ?? null
}

async function createUser(name: string, email: string, passwordHash: string): Promise<DbUser> {
  await ensureInitialized()

  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO auth_user (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  )

  return {
    id: result.insertId,
    name,
    email,
    password_hash: passwordHash,
  }
}

async function closeDatabase() {
  await pool.end()
}

export type { DbUser }
export { closeDatabase, createUser, findUserByEmail }
