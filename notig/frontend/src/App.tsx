import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from "./api/authenticationService.ts";
import "./styles/login.css";

/**
 * Komponentti kirjautumista varten.
 * Käsittelee käyttäjän tunnistautumisen ja mahdollisen navigoinnin rekisteröitymissivulle.
 * @returns JSX.Element
 */
const App: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Käsittelee lomakkeen lähetyksen.
     * @param {FormEvent<HTMLFormElement>} e - Lomakkeen tapahtuma
     */
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser({ email, password });

            if (response.status === "success") {
                navigate("/dashboard");
            } else {
                setError("Kirjautuminen epäonnistui: " + response.message);
            }
        } catch (error: any) {
            console.error("Kirjautumisvirhe:", error);
            setError(error.response?.data?.message || "Kirjautuminen epäonnistui");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <h1 className="login-title">NotiG Kirjautuminen</h1>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
                <div className="login-group">
                    <label className="login-label">Sähköposti</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        placeholder="example@email.com"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="login-group">
                    <label className="login-label">Salasana</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        placeholder="Salasana"
                        disabled={loading}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Kirjaudutaan..." : "Kirjaudu"}
                </button>
            </form>

            <div className="login-footer">
                <p className="register-prompt">Eikö sinulla ole tiliä? Rekisteröidy <Link to="/register">tästä</Link></p>
            </div>
        </div>
    );
}

export default App;