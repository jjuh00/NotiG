import express from "express";
import { createNoteHandler, getNotesByUser } from "../controllers/noteController.ts";

const router = express.Router();

/**
 * Muistiinpanon luomisreitti
 */
router.post("/api/notes", createNoteHandler);

/**
 * Käyttäjän muistiinpanojen reitti
 */
router.get("/api/notes/:userId", getNotesByUser);

export default router;