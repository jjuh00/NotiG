import { Request, Response } from "express";
import { createNote, getUserNotes } from "../database/noteSQL.ts";
import { findUserById } from "../database/userSQL.ts";

/**
 * Käsittelee uuden muistiinpanon luomisen.
 * @param {Request} req - Expressin Request-olio (sisältää muistiinpanon tiedot)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function createNoteHandler(req: Request, res: Response): Promise<void> {
    try {
        const { userId, title, content, fontFamily, fontSize, color, isBold, isItalic, isUnderline } = req.body;

        if (!userId || !title) {
            res.status(400).json({ status: "error", message: "Pakollisia tietoja puuttuu" });
            return;
        }

        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({ status: "error", message: "Käyttäjää ei löytynyt" });
            return;
        }

        const noteId = await createNote({
            user_id: userId,
            title,
            content,
            font_family: fontFamily || "Inter",
            font_size: fontSize || 16,
            color: color || "whitesmoke",
            is_bold: !!isBold,
            is_italic: !!isItalic,
            is_underline: !!isUnderline,
            is_pinned: false
        });

        res.status(201).json({ status: "created", noteId });
    } catch (error) {
        console.error("Muistiinpanon luomisessa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanon luomisessa: " + error });
    }
}

/**
 * Hakee käyttäjän muistiinpanot.
 * @param {Request} req - Expressin Request-olio (sisältää käyttäjän ID:n)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function getNotesByUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ status: "error", message: "Käyttäjä ID puuttuu" });
            return;
        }

        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({ status: "error", message: "Käyttäjää ei löytynyt" });
            return;
        }

        const notes = await getUserNotes(userId);
        const formattedNotes = notes.map(note => ({
            ...note,
            isBold: !!note.is_bold,
            isItalic: !!note.is_italic,
            isUnderline: !!note.is_underline,
            isPinned: !!note.is_pinned,
            fontFamily: note.font_family,
            fontSize: note.font_size,
            lastModified: note.updated_at ? note.updated_at : note.created_at
        }));

        res.status(200).json({ status: "ok", notes: formattedNotes });
    } catch (error) {
        console.error("Käyttäjän muistiinpanojen haussa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanojen haussa: " + error });
    }
}