import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

// SQLite initialization + versioned migrations for QubWatch.
// Database lives at DB_PATH or data/qubwatch.sqlite (gitignored).
// Migrations in server/migrations/*.sql run once each, tracked in
// schema_migrations. Seed inserts use INSERT OR IGNORE so reopening
// the database never duplicates data.
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'qubwatch.sqlite')

let db = null

export function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
  }
  return db
}

export function migrate() {
  const database = getDb()
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
    );
  `)
  const dir = path.join(process.cwd(), 'server', 'migrations')
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
  const applied = new Set(
    database.prepare('SELECT version FROM schema_migrations').all().map((r) => r.version),
  )
  const insert = database.prepare('INSERT INTO schema_migrations (version) VALUES (?)')
  for (const file of files) {
    if (applied.has(file)) continue
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    const run = database.transaction(() => {
      database.exec(sql)
      insert.run(file)
    })
    run()
  }
  return files.filter((f) => !applied.has(f))
}
