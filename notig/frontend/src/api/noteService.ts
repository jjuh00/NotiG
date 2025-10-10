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
 * Hakee käyttäjän muistiinpanot.
 * @param {string} userId - Käyttäjän ID
 * @param {string} [searchQuery] - Hakukysely (valinnainen)
 * @returns {Promise<Note[]>} - Muistiinpanot
 */
export async function getUserNotes(userId: string, searchQuery?: string): Promise<Note[]> {
    let url = `${API_URL}/note/user/${userId}`;
    if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    const response = await axios.get(url);
    return response.data.notes;
}

/**
 * Hakee yksittäisen muistiinpanon ID:n perusteella.
 * @param {string} noteId - Muistiinpanon ID
 * @returns {Promise<Note>} - Muistiinpano
 */
export async function getNote (noteId: string): Promise<Note> {
    const response = await axios.get(`${API_URL}/note/notes/${noteId}`);
    return response.data.note;
}

/**
 * Luo uuden muistiinpanon.
 * @param {NoteData & { userId: string }} data - Muistiinpanon tiedot
 * @returns {Promise<CreateNoteResponse>} - Palvelimen vastaus
 */
export async function createNote(data: NoteData & { userId: string }): Promise<CreateNoteResponse> {
    const response = await axios.post(`${API_URL}/note`, data);
    return response.data;
}

/**
 * Päivittää olemassa olevan muistiinpanon.
 * @param {string} noteId - Muistiinpanon ID
 * @param {Partial<Note> & { content? string }} updates - Päivitettävät tiedot
 * @returns {Promise<{ status: string; }>} - Palvelimen vastaus
 */
export async function updateNote(noteId: string, updates: Partial<Note> & { content? : string }): Promise<{ status: string }> {
    const response = await axios.put(`${API_URL}/note/update/${noteId}`, updates);
    return response.data;
}

/**
 * Poistaa muistiinpanon.
 * @param {string} noteId - Muistiinpanon ID
 * @returns {Promise<{ status: string; }>} - Palvelimen vastaus
 */
export async function deleteNote(noteId: string): Promise<{ status: string }> {
    const response = await axios.delete(`${API_URL}/note/delete/${noteId}`);
    return response.data;
}

/**
 * Vie muistiinpanon PDF-muotoon.
 * @param noteId - Muistiinpanon ID
 * @returns {Promise<Blob>} - PDF-tiedosto Blob-muodossa
 */
export async function exportNoteAsPdf(noteId: string): Promise<Blob> {
    const response = await axios.get(`${API_URL}/note/${noteId}/export`, {
        responseType: "blob"
    });
    return response.data;
}