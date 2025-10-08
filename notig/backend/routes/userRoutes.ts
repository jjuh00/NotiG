import express from "express";
import { register, login, getUserById, updateProfile, deleteUserProfile } from '../controllers/userController.ts';

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
 * Reitti käyttäjätietojen hakemiseen ID:llä.
 * GET /api/user/:id
 */
router.get("/api/user/:id", getUserById);

/**
 * Käyttäjän tietojen päivitysreitti.
 * PUT /api/user/update
 */
router.put("/api/user/update", updateProfile);


/**
 * Käyttäjäprofiilin poistoreitti.
 * POST /api/user/delete
 */
router.post("/api/user/delete", deleteUserProfile);

export default router;