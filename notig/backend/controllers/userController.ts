import { Request, Response } from "express";
import { findUserByEmail, findUserByUsername, createUser } from "../database/userSQL.ts";
import bcrypt from "bcrypt";

/**
 * Käsittelee käyttäjän rekisteröitymisen.
 * @param {Request} req - Expressin Request-olio (sisältää käyttäjänimen, sähköpostin ja salasanan)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function register(req: Request, res: Response): Promise<void> {
    try {
        let { username, email, password } = req.body;

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
};

/**
 * Käsittelee käyttäjän kirjautumisen.
 * @param {Request} req - Expressin Request-olio (sisältää sähköpostin ja salasanan)
 * @param {Response} res - Expressin Response-olio
 * @return {Promise<void>}
 */
export async function login(req: Request, res: Response): Promise<void> {
    try {
        let { email, password } = req.body;

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
};