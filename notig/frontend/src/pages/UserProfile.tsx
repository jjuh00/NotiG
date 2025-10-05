import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { getCurrentUser, updateUserData } from '../api/userService.ts';
import { useNavigate } from 'react-router-dom';
import "../styles/user-profile.css";

interface ProfileData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface UserProfileProps {
    userId: string;
}

/**
 * Komponentti käyttäjäprofiilin hallintaan.
 * Näyttää käyttäjätiedot ja mahdollistaa niiden muokkaamisen.
 * @param {UserProfileProps} props - Komponentin propsit
 * @returns JSX.Element
 */
const UserProfile: React.FC<UserProfileProps> = ({ userId }: UserProfileProps) => {
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState<{ username: string; email: string;}>({
        username: '',
        email: ''
    });
    const [formData, setFormData] = useState<ProfileData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        loadUserData();
    }, [userId]);

    /**
     * Lataa nykyiset käyttäjätiedot.
     */
    const loadUserData = async () => {
        try {
            const userData = await getCurrentUser(userId);
            setOriginalData({
                username: userData.username ?? '',
                email: userData.email ?? ''
            });
            setFormData({
                username: userData.username ?? '',
                email: userData.email ?? '',
                password: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            console.error("Käyttäjätietojen latausvirhe:", error);
            setError("Käyttäjätietojen lataus epäonnistui");
        }
    };

    /**
     * Tarkistaa, onko käyttäjätiedot muuttuneet.
     * @returns {boolean} - true jos tiedot ovat muuttuneet, muuten false
     */
    const hasChanges = (): boolean => {
        return (
            formData.username !== originalData.username ||
            formData.email !== originalData.email ||
            formData.password !== ''
        )
    };

    /**
     * Tarkistaa käyttäjän syöttämät tiedot.
     * @returns {boolean} - true jos tiedot ovat kelvolliset, muuten false
     */
    const validateData = (): boolean => {
        if (formData.password !== '' && formData.password !== formData.confirmPassword) {
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
     * Käsittelee peruuta-napin klikkauksen.
     */
    const handleCancelClick = () => {
        navigate("/dashboard");
    };

    /**
     * Käsittelee tallenna-napin klikkauksen.
     * @param {FormEvent<HTMLFormElement>} e - Lomakkeen tapahtuma
     */
    const handleSaveClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!hasChanges()) {
            setError("Käyttäjätiedoissa ei ole muutoksia");
            return;
        }

        if (!validateData()) {
            return;
        }

        setShowPasswordModal(true);
    };

    /**
     * Sulkee salasanan vahvistusmodaalin.
     */
    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setError('');
    };

    /**
     * Käsittelee käyttäjätietojen päivityksen salasanan vahvistuksen jälkeen.
     */
    const handleUpdateProfile = async () => {
        if (!currentPassword) {
            setError("Syötä nykyinen salasana");
            return;
        }

        setError('');
        setLoading(true);

        try {
            const updateData: {
                userId: string;
                currentPassword: string;
                username?: string;
                email?: string;
                newPassword?: string;
            } = {
                userId,
                currentPassword,
            };

            if (formData.username !== originalData.username) {
                updateData.username = formData.username;
            }

            if (formData.email !== originalData.email) {
                updateData.email = formData.email;
            }

            if (formData.password !== '') {
                updateData.newPassword = formData.password;
            }

            const response = await updateUserData(updateData);

            if (response.status === "success") {
                setSuccessMessage("Käyttäjätiedot päivitetty onnistuneesti");
                setShowPasswordModal(false);
                setCurrentPassword('');
                setFormData({...formData, password: '', confirmPassword: ''});
                await loadUserData();
                setTimeout(() => {
                    navigate("/dashboard");
                }, 3000);
            } else {
                setError("Käyttäjätietojen päivitys epäonnistui: " + response.message);
            }
        } catch (error: any) {
            console.error("Käyttäjätietojen päivitysvirhe:", error);
            setError("Käyttäjätietojen päivitys epäonnistui");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <h1>Käyttäjäasetukset</h1>
            </div>

            <form className="user-profile-form" onSubmit={handleSaveClick}>
                <div className="profile-group">
                    <label className="profile-label">Käyttäjänimi</label>
                    <input 
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="profile-input"
                        placeholder="Käyttäjänimi"
                        minLength={2}
                        disabled={loading}
                        required
                    />
                </div>
                    
                <div className="profile-group">
                    <label className="profile-label">Sähköposti</label>
                    <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="profile-input"
                        placeholder="example@email.com"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="profile-group">
                    <label className="profile-label">Uusi salasana (jätä tyhjäksi, jos et halua vaihtaa)</label>
                    <input 
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="profile-input"
                        placeholder="Uusi salasana"
                        minLength={6}
                        disabled={loading}
                    />
                </div>

                <div className="profile-group">
                    <label className="profile-label">Vahvista uusi salasana</label>
                    <input 
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="profile-input"
                        placeholder="Vahvista uusi salasana"
                        minLength={6}
                        disabled={loading}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={handleCancelClick} disabled={loading}>
                        <i className="fi fi-br-cross"></i>
                    </button>
                    <button type="submit" className="save-button" disabled={loading}>
                        <i className="fi fi-br-check"></i>
                    </button>
                </div>
            </form>

            {showPasswordModal && (
                <div className="modal-overlay" onClick={closePasswordModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Vahvista salasana</h2>
                        <p className="modal-description">Syötä nykyinen salasanasi vahvistaaksesi muutokset.</p>

                        <div className="modal-group">
                            <label className="modal-label">Nykyinen salasana</label>
                            <input 
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="modal-input"
                                placeholder="Nykyinen salasana"
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-buttons">
                            <button className="modal-cancel-button" onClick={closePasswordModal} disabled>
                                <i className="fi fi-br-cross"></i>
                            </button>
                            <button className="modal-confirm-button" onClick={handleUpdateProfile} disabled={loading}>
                                <i className="fi fi-br-check"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;