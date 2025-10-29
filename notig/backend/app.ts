import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from './routes/userRoutes.ts';
import noteRoutes from './routes/noteRoutes.ts';
import { sessionConfig } from './middleware/sessionConfig.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app: Application = express();

// Väliohjelmistot

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(sessionConfig);

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

// Globaali virhekäsittelijä
app.use(errorHandler);

export default app;