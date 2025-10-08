import type { NoteUpdate } from '../types/Note.ts';

/**
 * Muuntaa muistiinpanon frontend-muodosta backend-muotoon.
 * Muuntaa camelCase-kentät snake_case-kentiksi.
 * @param {NoteUpdate} updates - Muistiinpano frontend-muodossa
 * @returns {Record <string, any>} Muistiinpano backend-muodossa
 */
export function convertNoteToDbFormat(updates: NoteUpdate): Record<string, any> {
    const dbUpdates: Record<string, any> = {};

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.fontFamily !== undefined) dbUpdates.font_family = updates.fontFamily;
    if (updates.fontSize !== undefined) dbUpdates.font_size = updates.fontSize;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.isBold !== undefined) dbUpdates.is_bold = updates.isBold;
    if (updates.isItalic !== undefined) dbUpdates.is_italic = updates.isItalic;
    if (updates.isUnderline !== undefined) dbUpdates.is_underline = updates.isUnderline;
    if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;

    return dbUpdates;
}

/**
 * Muuntaa muistiinpanon backend-muodosta frontend-muotoon.
 * Muuntaa snake_case-kentät camelCase-kentiksi.
 * @param {any} dbNote - Muistiinpano backend-muodossa
 * @returns {any} Muistiinpano-olio frontendille
 */
export function convertNoteFromDbFormat(dbNote: any): any {
    return {
        ...dbNote,
        isBold: !!dbNote.is_bold,
        isItalic: !!dbNote.is_italic,
        isUnderline: !!dbNote.is_underline,
        isPinned: !!dbNote.is_pinned,
        fontFamily: dbNote.font_family,
        fontSize: dbNote.font_size,     
        lastModified: dbNote.updated_at ? dbNote.updated_at : dbNote.created_at
    };
}

/**
 * Muuntaa backend-muodossa olevan muistiinpanolistan frontend-muotoon.
 * @param {any[]} dbNotes - Muistiinpanolista backend-muodossa
 * @returns {any[]} - Muistiinpanolista frontend-muodossa
 */
export function convertNotesFromDbFormat(dbNotes: any[]): any[] {
    return dbNotes.map(note => convertNoteFromDbFormat(note));
}