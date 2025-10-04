import express from "express";
import { register, login } from "../controllers/userController.ts";

const router = express.Router();

/**
 * Rekisteröitymisreitti.
 * POST /api/authentication/register
 */
router.post("/api/authentication/register", register);

/**
 * Kirjautumisreitti.
 * POST /api/authentication/login
 */
router.post("/api/authentication/login", login);

export default router;