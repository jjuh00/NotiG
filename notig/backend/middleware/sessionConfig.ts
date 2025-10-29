import session from "express-session";

/**
 * Määritellee express-session väliohjelmiston (middlewaren) asetukset.
 * @returns {session.SessionOptions} - Määritelty session-instanssi
 */
export const sessionConfig = session({
    secret: "408ff26aee3124c5e1ff7df4",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // localhost vaatii false (true, jos käytettäisiin HTTPS:ää)
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "lax",
    },
});