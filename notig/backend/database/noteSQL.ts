import { getDatabase } from './db.ts';
import type { Note } from '../types/Note.ts';

// Backend-muotoinen Note-tyyppi (snake_case-muotoilu)
interface DbNote {
    id: number;
    user_id: number;
    title: string;
    content?: string;
    font_family: string;
    font_size: number;
    color: string;
    is_bold: number;
    is_italic: number;
    is_underline: number;
    is_pinned: number;
    created_at: string;
    updated_at: string | null;
}


/**
 * Hakee käyttäjän muistiinpanot.
 * @param {string} userId - Käyttäjän ID
 * @return {Promise<DbNote[]>} - Lista muistiinpanoista
 */
export async function getUserNotes(userId: string): Promise<DbNote[]> {
    const db = getDatabase();
    return await db.all<DbNote[]>(
        `SELECT id, title, SUBSTR(content, 1, 50) as preview, font_family, font_size, color, 
        is_bold, is_italic, is_underline, is_pinned, created_at, updated_at
        FROM notes WHERE user_id = ? 
        ORDER BY updated_at DESC, created_at DESC`, [userId]
    );
}

/**
 * Hakee muistiinpanon ID:n perusteella.
 * @param {string} noteId - Muistiinpanon ID
 * @return {Promise<DbNote | undefined>} - Palauttaa Note-olion tai undefined, jos muistiinpanoa ei löydy
 */
export async function getNoteById(noteId: string): Promise<DbNote | undefined> {
    const db = getDatabase();
    return await db.get<DbNote>(
        `SELECT * FROM notes WHERE id = ?`, [noteId]
    );
}

/**
 * Luo uuden muistiinpanon tietokantaan.
 * @param {Omit<DbNote, "id" | "created_at" | "updated_at"> & { content: string}} note - Muistiinpanon tiedot
 * @return {Promise<number>} - Luodun muistiinpanon ID:n
 */
export async function createNote(note: {
    user_id: string;
    title: string;
    content: string;
    font_family: string;
    font_size: number;
    color: string;
    is_bold: boolean;
    is_italic: boolean;
    is_underline: boolean;
    is_pinned: boolean;
}): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
        `INSERT INTO notes (user_id, title, content, font_family, font_size, color, is_bold, is_italic, is_underline, is_pinned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [note.user_id, note.title, note.content, note.font_family, note.font_size, note.color,
        note.is_bold ? 1 : 0, note.is_italic ? 1 : 0, note.is_underline ? 1 : 0, note.is_pinned ? 1 : 0]
    );
    return result.lastID!;
}

/**
 * Päivittää muistiinpanon tiedot.
 * @param {string} noteId - Muistiinpanon ID
 * @param {Partial<Omit<DbNote, "id" | "user_id" | "created_at" | "updated_at">> & { content?: string }} updates - Muistiinpanon päivitettävät tiedot
 * @return {Promise<void>}
 */
export async function updateNote(noteId: string, updates: {
    title?: string;
    content?: string;
    font_family?: string;
    font_size?: number;
    color?: string;
    is_bold?: boolean;
    is_italic?: boolean;
    is_underline?: boolean;
    is_pinned?: boolean;
}): Promise<void> {
    const db = getDatabase();
    let fields: string[] = [];
    let values: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            if (["is_bold", "is_italic", "is_underline", "is_pinned"].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value ? 1 : 0);
            } else {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
    }

    if (fields.length === 0) return;

    fields.push("updated_at = CURRENT_TIMESTAMP");

    const sql = `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`;
    values.push(noteId);

    await db.run(sql, values);
}

/**
 * Poistaa muistiinpanon tietokannasta.
 * @param {string} noteId - Muistiinpanon ID
 * @return {Promise<void>}
 */
export async function deleteNote(noteId: string): Promise<void> {
    const db = getDatabase();
    await db.run(
        `DELETE FROM notes WHERE id = ?`, [noteId]
    );
}