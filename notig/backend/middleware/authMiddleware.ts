import { Request, Response, NextFunction } from "express";

// Laajennetaan session-tyyppiä, jotta sen kanssa voidaan käyttää userId:tä
declare module "express-session" {
    interface SessionData {
        userId: number;
    }
}

/**
 * Väliohjelmisto (eli middleware) käyttäjän autentikointiin.
 * Tarkistaa, onko käyttäjä kirjautunut sisään istuntoon tallennetun userId:n perusteella.
 * Palauttaa 401, jos käyttäjä ei ole kirjautunut sisään.
 * @param {Request} req - Expressin Request-olio
 * @param {Response} res - Expressin Response-olio
 * @param {NextFunction} next - Expressin NextFunction-olio
 * @returns {void}
 */
export const checkUserAuthentication = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.userId) {
        next();
    } else {
        console.log(req.session.userId);
        res.status(401).json({ status: "error", message: "Käyttäjä ei ole kirjautunut sisään" });
    }
}