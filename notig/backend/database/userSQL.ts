import { getDatabase } from './db.ts';

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
}

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
}

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
}

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
}

/**
 * Päivittää käyttäjän tiedot.
 * @param {string} id - Käyttäjän ID
 * @param {string} username - Uusi käyttäjänimi
 * @param {string} email - Uusi sähköposti
 * @param {string} hashedPassword - Uusi salattu salasana
 * @returns {Promise<void>}
 */
export async function updateUser(id: string, username: string, email: string, hashedPassword: string): Promise<void> {
    const db = getDatabase();
    const currentDate = new Date().toISOString();

    await db.run(
        `UPDATE users SET username = ?, email = ?, password = ?, updated_at = ? WHERE id = ?`,
        [username, email, hashedPassword, currentDate, id]
    );
}

/**
 * Poistaa käyttäjän kaikki muistiinpanot.
 * @param {string} userId - Käyttäjän ID
 * @returns {Promise<void>}
 */
export async function deleteUserNotes(userId: string): Promise<void> {
    const db = getDatabase();
    await db.run(
        `DELETE FROM notes WHERE user_id = ?`, [userId]
    );
}

/**
 * Poistaa käyttäjän tietokannasta.
 * @param {string} id - Käyttäjän ID
 * @returns {Promise<void>}
 */
export async function deleteUser(id: string): Promise<void> {
    const db = getDatabase();
    await db.run(
        `DELETE FROM users WHERE id = ?`, [id]
    );
}

export type { User };