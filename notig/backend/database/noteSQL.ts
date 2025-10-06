import { getDatabase } from "./db.ts";

export interface Note {
    id: string;
    user_id: string;
    title: string;
    preview: string;
    font_family: string;
    font_size: number;
    color: string;
    is_bold: boolean;
    is_italic: boolean;
    is_underline: boolean;
    is_pinned: boolean;
    created_at: string | Date;
    updated_at?: string | Date | null;
}

/**
 * Luo uuden muistiinpanon tietokantaan.
 * @param {Omit<Note, "id" | "preview" | "created_at" | "updated_at"> & { content: string}} note - Muistiinpanon tiedot
 * @return {Promise<number>} - Luodun muistiinpanon ID:n
 */
export async function createNote(note: Omit<Note, "id" | "preview" | "created_at" | "updated_at"> & { content: string; }): Promise<number> {
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
 * Hakee käyttäjän muistiinpanot.
 * @param {string} userId - Käyttäjän ID
 * @return {Promise<Note[]>} - Lista muistiinpanoista
 */
export async function getUserNotes(userId: string): Promise<Note[]> {
    const db = getDatabase();
    return await db.all<Note[]>(
        `SELECT id, title, SUBSTR(content, 1, 50) as preview, font_family, font_size, color, 
        is_bold, is_italic, is_underline, is_pinned, created_at, updated_at
        FROM notes WHERE user_id = ? 
        ORDER BY updated_at DESC, created_at DESC`, [userId]
    );
}