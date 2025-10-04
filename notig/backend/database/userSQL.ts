import { getDatabase } from "./db.ts";

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string | Date;
    updatedAt?: string | Date | null;
}

/**
 * Lisää uuden käyttäjän tietokantaan.
 * @param {string} username - Käyttäjänimi
 * @param {string} email - Sähköposti
 * @param {string} hashedPassword - Salattu salasana
 * @returns {Promise<number>} - Palauttaa lisätyn käyttäjän ID:n
 */
export async function createUser(username: string, email: string, hashedPassword: string): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, hashedPassword]
    );
    return result.lastID!;
};

/**
 * Hakee käyttäjän sähköpostin perusteella.
 * @param {string} email - Käyttäjän sähköposti
 * @return {Promise<User | undefined>} - Palauttaa User-olion tai undefined, jos käyttäjää ei löydy
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
    const db = getDatabase();
    return await db.get<User>(
        `SELECT * FROM users WHERE email = ?`, [email]
    );
};

/**
 * Hakee käyttäjän käyttäjänimen perusteella.
 * @param {string} username - Käyttäjän käyttäjänimi
 * @return {Promise<User | undefined>} - Palauttaa User-olion tai undefined, jos käyttäjää ei löydy
 */
export async function findUserByUsername(username: string): Promise<User | undefined> {
    const db = getDatabase();
    return await db.get<User>(
        `SELECT * FROM users WHERE username = ?`, [username]
    );
};

/**
 * Hakee käyttäjän ID:n perusteella.
 * @param {string} id - Käyttäjän ID
 * @return {Promise<User | undefined>} - Palauttaa User-olion tai undefined, jos käyttäjää ei löydy
 */
export async function findUserById(id: string): Promise<User | undefined> {
    const db = getDatabase();
    return await db.get<User>(
        `SELECT * FROM users WHERE id = ?`, [id]
    );
};

export type { User };