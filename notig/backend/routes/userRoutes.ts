import express from "express";
import { register, login, updateProfile, getUserById } from "../controllers/userController.ts";

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

/**
 * Käyttäjän tietojen päivitysreitti.
 */
router.put("/api/user/update", updateProfile);

/**
 * Reitti käyttäjätietojen hakemiseen ID:llä.
 */
router.get("/api/user/:id", getUserById);

export default router;