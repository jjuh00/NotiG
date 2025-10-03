import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponentti kirjautumista varten.
 * Käsittelee käyttäjän tunnistautumisen ja mahdollisen navigoinnin rekisteröitymissivulle.
 * @returns JSX.Element
 */
const App: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Käsittelee lomakkeen lähetyksen.
     */
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        setLoading(true);

        // TODO: Toteuta kirjautumislogiikka täällä
        setTimeout(() => {
            console.log('Kirjautuminen onnistui:', { email, password });
            setLoading(false);
            // Navigoi pääsivulle kirjautumisen jälkeen
        }, 6000);
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <h1 className="login-title">NotiG Kirjautuminen</h1>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                    <label className="input-label">Sähköposti</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="example@email.com"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Salasana</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Salasana"
                        minLength={6}
                        disabled={loading}
                        required
                    />
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? <i className="fi fi-br-rotate-right"></i> : "Kirjaudu"}
                </button>
            </form>

            <div className="login-footer">
                <p className="register-prompt">Eikö sinulla ole tiliä? Rekisteröidy <Link to="/register">tästä</Link></p>
            </div>
        </div>
    );
}

export default App;