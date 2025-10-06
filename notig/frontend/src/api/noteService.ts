import axios from "axios";
import type { Note } from '../types/Note.ts';

const API_URL = "http://127.0.0.1:3003/api";

export interface NoteData {
    title: string;
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
}

interface CreateNoteResponse {
    status: string;
    noteId?: string;
    message?: string;
}

/**
 * Luo uuden muistiinpanon.
 * @param {NoteData & { userId: string }} data - Muistiinpanon tiedot
 * @returns {Promise<CreateNoteResponse>} - Palvelimen vastaus
 */
export async function createNote(data: NoteData & { userId: string }): Promise<CreateNoteResponse> {
    const response = await axios.post(`${API_URL}/notes`, data);
    return response.data;
}

/**
 * Hakee käyttäjän muistiinpanot.
 * @param {string} userId - Käyttäjän ID
 * @returns {Promise<Note[]>} - Muistiinpanot
 */
export async function getUserNotes(userId: string): Promise<Note[]> {
    const response = await axios.get(`${API_URL}/notes/${userId}`);
    return response.data.notes;
}