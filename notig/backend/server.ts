import app from "./app.ts";
import { initializeDatabase } from "./database/db.ts";

const PORT = 3003;
const HOST = "127.0.0.1";

/**
 * Käynnistää palvelimen ja alustaa tietokannan.
 * @returns {Promise<void>}
 */
async function startServer(): Promise<void> {
    try {
        // Alustetaan palvelin
        await initializeDatabase();
        console.info("Tietokanta yhdistetty onnistuneesti");

        // Käynnistetään palvelin
        app.listen(PORT, () => {
            console.info(`Palvelin käynnissä osoitteessa http://${HOST}:${PORT}`);
            console.info(`Palvelimen tila: http://${HOST}:${PORT}/api/health`);
        });
    } catch (error) {
        console.error("Palvelimen käynnistys epäonnistui:", error);
        process.exit(1);
    }
}

// Käsitellään ei-käsitellyt poikkeukset
process.on("uncaughtException", (error) => {
    console.error("Ei-käsitelty poikkeus:", error);
    process.exit(1);
});

// Käsitellään ei-käsitellyt Promise-hylkäykset
process.on("unhandledRejection", (reason, promise) => {
    console.error("Ei-käsitelty Promise-hylkäys:", reason);
    process.exit(1);
});

startServer();