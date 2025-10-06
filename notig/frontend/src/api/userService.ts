import axios from "axios";

const API_URL = "http://127.0.0.1:3003/api";

interface UpdateUserData {
    userId: string;
    currentPassword: string;
    username?: string;
    email?: string;
    newPassword?: string;
}

interface DeleteUserData {
    userId: string;
    currentPassword: string;
}

interface UserResponse {
    status: string;
    message?: string;
    userId?: string;
    username?: string;
    email?: string;
}

/**
 * Päivittää käyttäjätiedot.
 * @param {UpdateUserData} data - Päivitettävät tiedot
 * @returns {Promise<UserResponse>} - Palvelimen vastaus
 */
export async function updateUserData(data: UpdateUserData): Promise<UserResponse> {
    const response = await axios.put(`${API_URL}/user/update`, data);
    return response.data;
}

/**
 * Hakee käyttäjätiedot ID:n perusteella.
 * @param {string} userId - Käyttäjän ID
 * @returns {Promise<UserResponse>} - Palvelimen vastaus
 */
export async function getCurrentUser(userId: string): Promise<UserResponse> {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
}

/**
 * Poistaa käyttäjäntilin.
 * @param {DeleteUserData} data - Poistettavan käyttäjän tiedot
 * @returns {Promise<UserResponse>} - Palvelimen vastaus
 */
export async function deleteUser(data: DeleteUserData): Promise<UserResponse> {
    const response = await axios.post(`${API_URL}/user/delete`, data);
    return response.data;
}

/**
 * Kirjaa käyttäjän ulos (paikallinen toiminto)
 * @returns {Promise<UserResponse>} - Palvelimen vastaus
 */
export async function logoutUser(): Promise<UserResponse> {
    return { status: "success" }; 
}