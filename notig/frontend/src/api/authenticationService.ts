import axios from "axios";

const API_URL = "http://127.0.0.1:3003/api";

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthenticationResponse {
    status: string;
    message: string;
    userId?: string;
    username?: string;
}

/**
 * Käsittelee käyttäjän rekisteröitymisen.
 * @param {RegisterData} data - Rekisteröitymisen tiedot
 * @returns {Promise<AuthenticationResponse>} - Palvelimen vastaus
 */
export async function registerUser(data: RegisterData): Promise<AuthenticationResponse> {
    const reponse = await axios.post(`${API_URL}/authentication/register`, data);
    return reponse.data;
};

/**
 * Käsittelee käyttäjän kirjautumisen.
 * @param {LoginData} data - Kirjautumisen tiedot
 * @returns {Promise<AuthenticationResponse>} - Palvelimen vastaus
 */
export async function loginUser(data: LoginData): Promise<AuthenticationResponse> {
    const response = await axios.post(`${API_URL}/authentication/login`, data);
    return response.data;
};