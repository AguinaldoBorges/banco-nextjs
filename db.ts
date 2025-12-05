// db.ts
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let cachedDb: Database | null = null;

export async function openDB(): Promise<Database> {
  if (cachedDb) return cachedDb;
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
  // inicializa tabelas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      balance REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // garante registro de carteira
  await db.run(`INSERT OR IGNORE INTO wallet (id, balance) VALUES (1, 0)`);
  cachedDb = db;
  return db;
}
