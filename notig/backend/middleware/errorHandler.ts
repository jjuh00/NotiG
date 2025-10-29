import { Request, Response, NextFunction } from "express";

/**
 * Globaali virheenkäsittelijä-väliohjelmisto (middleware) 
 * Tulostaa konsoliin virheen ja lähettää JSON-vastauksen
 * @param {Error} err - Virhe-olio
 * @param {Request} req - Expressin Request-olio
 * @param {Response} res - Expressin Response-olio
 * @param {NextFunction} next - Expressin NextFunction-olio
 * @returns {void}
 */

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(`[VIRHE] ${req.method} ${req.originalUrl}:`, err.message);

    res.status(500).json({
        status: "error",
        message: "Palvelinvirhe",
        detail: err.message
    })
}