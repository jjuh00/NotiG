import { Request, Response } from "express";
import { 
    findUserByEmail, 
    findUserByUsername, 
    createUser, 
    findUserById, 
    updateUser, 
    deleteUserNotes, 
    deleteUser
} from '../database/userSQL.ts';
import bcrypt from "bcrypt";

/**
 * Käsittelee käyttäjän rekisteröitymisen.
 * @param {Request} req - Expressin Request-olio (sisältää käyttäjänimen, sähköpostin ja salasanan)
 * @param {Response} res - Expressin Response-olio
 * @returns {Promise<void>}
 */
export async function register(req: Request, res: Response): Promise<void> {
    try {
        const { username, email, password } = req.body;

        // Tarkistetaan syötteet
        if (!username || !email || !password) {
            res.status(400).json({ status: "error", message: "Pakollisia tietoja puuttuu" });
            return;
        }

        // Tarkistetaan, onko käyttäjä jo olemassa
        const existingUserByEmail = await findUserByEmail(email);
        if (existingUserByEmail) {
            res.status(400).json({ status: "error", message: "Sähköposti on jo käytössä" });
            return;
        }

        const existingUserByUsername = await findUserByUsername(username);
        if (existingUserByUsername) {
            res.status(400).json({ status: "error", message: "Käyttäjänimi on jo käytössä" });
            return;
        }

        // Salataan salasana
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Luodaan uusi käyttäjä
        const userId = await createUser(username, email, hashedPassword);

        res.status(201).json({ status: "created", userId });
    } catch (error) {
        console.error("Rekisteröitymisessä ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe rekisteröitymisessä: " + error });
    }
}

/**
 * Käsittelee käyttäjän kirjautumisen.
 * @param {Request} req - Expressin Request-olio (sisältää sähköpostin ja salasanan)
 * @param {Response} res - Expressin Response-olio
 * @returns {Promise<void>}
 */
export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        // Tarkistetaan syötteet
        if (!email || !password) {
            res.status(400).json({ status: "error", message: "Pakollisia tietoja puuttuu" });
            return;
        }

        // Haetaan käyttäjä sähköpostin perusteella
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ status: "error", message: "Väärä sähköposti tai salasana" });
            return;
        }

        // Tarkistetaan salasana
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            res.status(401).json({ status: "error", message: "Väärä sähköposti tai salasana" });
            return;
        }

        res.status(200).json({ status: "success", userId: user.id, username: user.username });
    } catch (error) {
        console.error("Kirjautumisessa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe kirjautumisessa: " + error });
    }
}

/**
 * Hakee käyttäjän ID:n perusteella.
 * @param {Request} req - Expressin Request-olio (sisältää käyttäjän ID:n)
 * @param {Response} res - Expressin Response-olio 
 * @returns {Promise<void>}
 */
export async function getUserById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ status: "error", message: "Käyttäjä ID puuttuu" });
            return;
        }

        const user = await findUserById(id);
        if (!user) {
            res.status(404).json({ status: "error", message: "Käyttäjää ei löytynyt" });
            return;
        }

        // Ei palauteta salasanaa
        res.status(200).json({
            status: "ok",
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error("Käyttäjän hakemisessa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe käyttäjätietojen haussa: " + error });
    }
}

/**
 * Käsittelee käyttäjän tietojen päivityksen.
 * @param {Request} req - Expressin Request-olio (sisältää päivitettävät tiedot)
 * @param {Response} res - Expressin Response-olio
 * @returns {Promise<void>}
 */
export async function updateProfile(req: Request, res: Response): Promise<void> {
    try {
        const { userId, currentPassword, username, email, newPassword } = req.body;

        // Tarkistetaan syötteet
        if (!userId || !currentPassword) {
            res.status(400).json({ status: "error", message: "Pakollisia tietoja puuttuu" });
            return;
        }

        // Haetaan käyttäjä ID:n perusteella
        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({ status: "error", message: "Käyttäjää ei löytynyt" });
            return;
        }

        // Tarkistetaan salasana
        const passwordMatches = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatches) {
            res.status(401).json({ status: "error", message: "Väärä salasana" });
            return;
        }

        // Tarkisteetaan, onko uusi käyttäjänimi tai sähköposti jo käytössä
        if (username && username !== user.username) {
            const existingUser = await findUserByUsername(username);
            if (existingUser) {
                res.status(400).json({ status: "error", message: "Käyttäjänimi on jo käytössä" });
                return;
            }
        }

        if (email && email !== user.email) {
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                res.status(400).json({ status: "error", message: "Sähköposti on jo käytössä" });
                return;
            }
        }

        // Salataan uusi salasana, jos se on annettu
        let hashedPassword = user.password;
        if (newPassword) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        }

        // Päivitetään käyttäjän tiedot
        await updateUser(userId, username || user.username, email || user.email, hashedPassword);

        res.status(200).json({ status: "success" });
    } catch (error) {
        console.error("Käyttäjätietojen päivittämisessä ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe käyttäjätietojen päivittämisessä: " + error });
    }
}

/**
 * Käsittelee käyttäjän poistamisen.
 * @param {Request} req - Expressin Request-olio (sisältää käyttäjän ID:n ja salasanan)
 * @param {Response} res - Expressin Response-olio
 * @returns {Promise<void>}
 */
export async function deleteUserProfile(req: Request, res: Response): Promise<void> {
    const { userId, currentPassword } = req.body;

    if (!userId || !currentPassword) {
        res.status(400).json({ status: "error", message: "Pakollisia tietoja puuttuu" });
        return;
    }

    const user = await findUserById(userId);
    if (!user) {
        res.status(404).json({ status: "error", message: "Käyttäjää ei löytynyt" });
        return;
    }

    // Tarkistetaan salasana
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
        res.status(401).json({ status: "error", message: "Väärä salasana" });
        return;
    }

    try {
        // Poistetaan käyttäjän muistiinpanot
        await deleteUserNotes(userId);
        // Poistetaan käyttäjä
        await deleteUser(userId);
        res.status(204).json({ status: "success" });
    } catch (error) {
        console.error("Käyttäjän poistamisessa ilmeni virhe:", error);
        res.status(500).json({ status: "error", message: "Palvelinvirhe käyttäjän poistamisessa: " + error });
    }
}