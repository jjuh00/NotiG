import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from "../api/authenticationService.ts";
import "../styles/register.css";

interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

/**
 * Komponentti rekisteröitymistä varten.
 * Käsittelee käyttäjän rekisteröitymisen ja mahdollisen navigoinnin kirjautumissivulle.
 * @returns JSX.Element
 */
const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Tarkistaa käyttäjän syöttämät tiedot.
     * @returns {boolean} - true jos tiedot ovat kelvolliset, muuten false
     */
    const validateData = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setError("Salasanat eivät vastaa toisiaan");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Virheellinen sähköpostiosoite");
            return false;
        }

        return true;
    };

    /**
     * Käsittelee lomakkeen lähetyksen.
     * @param {FormEvent<HTMLFormElement>} e - Lomakkeen tapahtuma
     */
    const handleRegister = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!validateData()) {
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.status === "created") {
                navigate("/login");
            } else {
                setError("Rekisteröityminen epäonnistui: " + response.message);
            }
        } catch (error: any) {
            console.error("Rekisteröitymisvirhe:", error);
            setError(error.response?.data?.message || "Rekisteröityminen epäonnistui");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-header">
                <h1 className="register-title">NotiG Rekisteröityminen</h1>
            </div>

            <form className="register-form" onSubmit={handleRegister}>
                <div className="register-group">
                    <label className="register-label">Käyttäjänimi</label>
                    <input 
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="register-input"
                        placeholder="Käyttäjänimi"
                        minLength={2}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="register-group">
                    <label className="register-label">Sähköposti</label>
                    <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="register-input"
                        placeholder="example@email.com"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="register-group">
                    <label className="register-label">Salasana</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="register-input"
                        placeholder="Salasana"
                        minLength={6}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="register-group">
                    <label className="register-label">Vahvista salasana</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="register-input"
                        placeholder="Vahvista salasana"
                        minLength={6}
                        disabled={loading}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="register-button">
                    {loading ? "Rekisteröidytään..." : "Rekisteröidy"}
                </button>
            </form>

            <div className="register-footer">
                <p className="login-prompt">Onko sinulla jo tili? Kirjaudu <Link to="/">tästä</Link></p>
            </div>
        </div>
    );
}

export default Register;