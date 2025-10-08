import { Request, Response } from "express";
import { getUserNotes, getNoteById, createNote, updateNote, deleteNote } from '../database/noteSQL.ts';
import { findUserById } from '../database/userSQL.ts';
import type { NoteUpdate } from '../types/Note.ts';
import { convertNotesFromDbFormat, convertNoteFromDbFormat, convertNoteToDbFormat } from '../utils/noteConverter.ts';
import PDFDocument from "pdfkit";


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

        const userNotes = await getUserNotes(userId);

        res.status(200).json({ status: "ok", notes: convertNotesFromDbFormat(userNotes) });
    } catch (error) {
        console.error("Käyttäjän muistiinpanojen haussa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanojen haussa: " + error });
    }
}

/**
 * Hakee yksittäisen muistiinpanon ID:n perusteella.
 * @param {Request} req - Expressin Request-olio (sisältää muistiinpanon ID:n)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function getNoteHandler(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const singleNote = await getNoteById(id);
        if (!singleNote) {
            res.status(404).json({ status: "error", message: "Muistiinpanoa ei löytynyt" });
            return;
        }

        res.status(200).json({ status: "ok", note: convertNoteFromDbFormat(singleNote) });
    } catch (error) {
        console.error("Muistiinpanon haussa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanon haussa: " + error });
    }
}

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
 * Käsittelee muistiinpanon päivityksen.
 * @param {Request} req - Expressin Request-olio (sisältää muistiinpanon ID:n ja päivitettävät tiedot)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function updateNoteHandler(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updates: NoteUpdate = req.body;

    try {
        const note = await getNoteById(id);
        if (!note) {
            res.status(404).json({ status: "error", message: "Muistiinpanoa ei löytynyt" });
            return;
        }

        await updateNote(id, convertNoteToDbFormat(updates));
        res.status(204).json({ status: "success" });
    } catch (error) {
        console.error("Muistiinpanon päivittämisessä ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanon päivittämisessä: " + error });
    }
}

/**
 * Käsittelee muistiinpanon poistamisen.
 * @param {Request} req - Expressin Request-olio (sisältää muistiinpanon ID:n)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function deleteNoteHandler(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const note = await getNoteById(id);
        if (!note) {
            res.status(404).json({status: "error", message: "Muistiinpanoa ei löytynyt" });
            return;
        }

        await deleteNote(id);
        res.status(204).json({ status: "success" });
    } catch (error) {
        console.error("Muistiinpanon poistamisessa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanon poistamisessa: " + error });
    }
}

/**
 * Käsittelee muistiinpanon viennin PDF-tiedostoksi.
 * @param {Request} req - Expressin Request-olio (sisältää muistiinpanon ID:n)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function generateNotePdf(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const dbNote = await getNoteById(id);
        if (!dbNote) {
            res.status(404).json({ status: "error", message: "Muistiinpanoa ei löytynyt" });
            return;
        }

        const note = convertNoteFromDbFormat(dbNote);

        // Luodaan PDF-dokumentti
        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${note.title}.pdf`);

        doc.pipe(res);

        // Määritetään fontti PDFKitin tukemiin fontteihin
        let pdfFont = "Helvetica"; // Oletusfontti
        if (note.fontFamily.includes("Times")) {
            pdfFont = "Times-Roman";
        } else if (note.fontFamily.includes("Courier")) {
            pdfFont = "Courier";
        } else if (note.fontFamily === "Arial" || note.fontFamily === "Inter" || note.fontFamily === "Verdana") {
            pdfFont = "Helvetica";
        }

        // Määritetään fontin variantti (paksu, kursivoitu)
        let fontVariant = pdfFont;
        if (note.isBold && note.isItalic) {
            fontVariant = `${pdfFont}-BoldOblique`;
        } else if (note.isBold) {
            fontVariant = `${pdfFont}-Bold`;
        } else if (note.isItalic) {
            fontVariant = `${pdfFont}-Oblique`;
        }

        // Lisätään otsikko
        doc.fontSize(20); // Otsikon fonttikoko, oletus 20 (sama kuin note-editor.css note-title font-size)
        doc.text(note.title);

        // Määritetään sisällön fontti, koko ja väri
        doc.font(fontVariant);
        doc.fontSize(note.fontSize);
        doc.fillColor(note.color);

        doc.moveDown(); // Lisää tyhjää otsikon ja sisällön väliin

        // Lisätään sisältö
        doc.text(note.content || '', {
            underline: note.isUnderline
        });

        doc.end()
    } catch (error) {
        console.error("Muistiinpanon PDF-viennissä ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe muistiinpanon PDF-viennissä: " + error });
    }
}