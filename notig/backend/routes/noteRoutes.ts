import express from "express";
import { getNotesByUser, getNoteHandler, createNoteHandler, updateNoteHandler, deleteNoteHandler } from '../controllers/noteController.ts';

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

export default router;