import express from "express";
import { checkUserAuthentication } from '../middleware/authMiddleware.ts';
import { 
    register,
    login, 
    logout,
    getUserById, 
    updateProfile, 
    deleteUserProfile 
} from '../controllers/userController.ts';

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
 * Uloskirjautumisreitti.
 * POST /api/authentication/user/logout
 */
router.post("/api/user/logout", checkUserAuthentication, logout);

/**
 * Reitti käyttäjätietojen hakemiseen ID:llä.
 * GET /api/user/:id
 */
router.get("/api/user/:id", checkUserAuthentication, getUserById);

/**
 * Käyttäjän tietojen päivitysreitti.
 * PUT /api/user/update
 */
router.put("/api/user/update", checkUserAuthentication, updateProfile);


/**
 * Käyttäjäprofiilin poistoreitti.
 * POST /api/user/delete
 */
router.post("/api/user/delete", checkUserAuthentication, deleteUserProfile);

export default router;