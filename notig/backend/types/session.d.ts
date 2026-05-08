import "express-session";

/**
 * Laajennetaan express-sessionin SessionData-tyyppiä lisäämällä userId-kenttä.
 */
declare module "express-session" {
    interface SessionData {
        // Kirjautuneen käyttäjän ID
        userId: number;
    }
}