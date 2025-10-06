import type { Database } from "sqlite";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { open } from "sqlite";
import path from "path";
import sqlite3 from "sqlite3";

let db: Database;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Alustaa SQLite-tietokannan/tietokantayhteyden ja luo tarvittavat taulut, jos niitä ei ole.
 * @returns {Promise<Database>} - Tietokantainstanssi
 */
export async function initializeDatabase(): Promise<Database> {
	if (db) {
        return db;
    }

    // Avataan tietokantayhteys
    db = await open({
        filename: path.join(__dirname, "../../notig.db"),
        driver: sqlite3.Database
    });

    // Luodaan users-taulu, jos se ei ole olemassa
    await db?.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME
        )
    `);

    // Luodaan notes-taulu, jos se ei ole olemassa
    await db?.exec(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            font_family TEXT DEFAULT "Inter",
            font_size INTEGER DEFAULT 16,
            color TEXT DEFAULT "whitesmoke",
            is_bold INTEGER DEFAULT 0,
            is_italic INTEGER DEFAULT 0,
            is_underline INTEGER DEFAULT 0,
            is_pinned INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Luodaan indeksointi nopeampia kyselyjä varten
    await db?.exec(`
        CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes (user_id);
        CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned);
    `);

    console.info("Tietokanta alustettu onnistuneesti");
    return db;
}

/**
 * Hakee tietokantainstanssin.
 * @returns {Database} - Tietokantainstanssi
 * @throws {Error} - Jos tietokantaa ei ole alustettu
 */
export function getDatabase(): Database {
    if (!db) {
        throw new Error("Tietokantaa ei ole alustettu. Kutsu initializeDatabase-funktiota ensin");
    }
    return db;
}