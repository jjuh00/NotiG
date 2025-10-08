import express from "express";
import { Application, Request, Response, NextFunction } from "express";
import userRoutes from './routes/userRoutes.ts';
import noteRoutes from './routes/noteRoutes.ts';

const app: Application = express();

/**
 * CORS-väliohjelmisto
 * @param {Request} req - Expressin Request-olio
 * @param {Response} res - Expressin Response-olio
 * @param {NextFunction} next - Expressin next-funktio
 */
var cors = (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reitit
app.use(userRoutes);
app.use(noteRoutes);

// Palvelintila
app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "Palvelin on täysissä voimissaan!" });
});

// 404-käsittelijä
app.use((req: Request, res: Response) => {
    res.status(404).json({ status: "error", message: "Reittiä ei löytynyt" });
});

// Virhekäsittelijä
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Palvelinvirhe:", error);
    res.status(500).json({ status: "error", message: "Palvelinvirhe" });
});

export default app;