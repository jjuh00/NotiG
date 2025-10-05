import axios from "axios";

const API_URL = "http://127.0.0.1:3003/api";

interface UpdateUserData {
    userId: string;
    currentPassword: string;
    username?: string;
    email?: string;
    newPassword?: string;
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

export async function logoutUser(): Promise<UserResponse> {
    return { status: "success" }; 
}