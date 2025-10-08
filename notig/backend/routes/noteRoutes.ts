import express from "express";
import { 
    getNotesByUser, 
    getNoteHandler, 
    createNoteHandler, 
    updateNoteHandler, 
    deleteNoteHandler,
    generateNotePdf
} from '../controllers/noteController.ts';

const router = express.Router();

/**
 * Käyttäjän muistiinpanojen reitti
 * GET /api/note/user/:userId
 */
router.get("/api/note/user/:userId", getNotesByUser);

/**
 * Yksittäisen muistiinpanon hakureitti
 * GET /api/note/notes/:id
 */
router.get("/api/note/notes/:id", getNoteHandler);

/**
 * Muistiinpanon luomisreitti
 * POST /api/note
 */
router.post("/api/note", createNoteHandler);

/**
 * Muistiinpanon päivitysreitti
 * PUT /api/note/update/:id
 */
router.put("/api/note/update/:id", updateNoteHandler);

/**
 * Muistiinpanon poistamisreitti
 * DELETE /api/note/delete/:id
 */
router.delete("/api/note/delete/:id", deleteNoteHandler);

/**
 * Muistiinpanon PDF-vientireitti
 * GET /api/note/:id/export
 */
router.get("/api/note/:id/export", generateNotePdf);

export default router;