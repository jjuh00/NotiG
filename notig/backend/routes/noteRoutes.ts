import express from "express";
import { checkUserAuthentication } from '../middleware/authMiddleware.ts';
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
router.get("/api/note/user/:userId", checkUserAuthentication, getNotesByUser);

/**
 * Yksittäisen muistiinpanon hakureitti
 * GET /api/note/notes/:id
 */
router.get("/api/note/notes/:id", checkUserAuthentication, getNoteHandler);

/**
 * Muistiinpanon luomisreitti
 * POST /api/note
 */
router.post("/api/note", checkUserAuthentication, createNoteHandler);

/**
 * Muistiinpanon päivitysreitti
 * PUT /api/note/update/:id
 */
router.put("/api/note/update/:id", checkUserAuthentication, updateNoteHandler);

/**
 * Muistiinpanon poistamisreitti
 * DELETE /api/note/delete/:id
 */
router.delete("/api/note/delete/:id", checkUserAuthentication, deleteNoteHandler);

/**
 * Muistiinpanon PDF-vientireitti
 * GET /api/note/:id/export
 */
router.get("/api/note/export/:id", checkUserAuthentication, generateNotePdf);

export default router;