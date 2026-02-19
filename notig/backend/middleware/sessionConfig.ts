import session from "express-session";
import crypto from "crypto";

/**
 * Määritellee express-session väliohjelmiston (middlewaren) asetukset.
 * @returns {session.SessionOptions} - Määritelty session-instanssi
 */
export const sessionConfig = session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // localhost vaatii false (true, jos käytettäisiin HTTPS:ää)
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "lax",
    },
});