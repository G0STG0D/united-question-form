import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "submissions.db");

// Singleton across hot-reloads in dev
const globalForDb = globalThis as unknown as { _db: Database.Database | undefined };

function initTables(db: Database.Database) {
    db.pragma("journal_mode = WAL");
    db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now')),
      submitter_uuid TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('MC','FT')),
      question TEXT NOT NULL,
      correct_answer TEXT,
      answers_json TEXT NOT NULL,
      difficulty TEXT,
      minecraft_username TEXT,
      discord_username TEXT,
      additional_notes TEXT,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS blocked_accounts (
      submitter_uuid TEXT PRIMARY KEY,
      blocked_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function getDb(): Database.Database {
    if (!globalForDb._db) {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        globalForDb._db = new Database(DB_PATH);
        initTables(globalForDb._db);
    }
    return globalForDb._db;
}

export type SubmissionRow = {
    id: number;
    created_at: string;
    submitter_uuid: string;
    type: "MC" | "FT";
    question: string;
    correct_answer: string | null;
    answers_json: string;
    difficulty: string | null;
    minecraft_username: string | null;
    discord_username: string | null;
    additional_notes: string | null;
    status: string;
};
