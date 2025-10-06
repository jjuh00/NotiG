import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UserContextType {
    userId: string | null;
    username: string | null;
    setUser: (userId: string, username: string) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

/**
 * UserProvider-komponentti, joka tarjoaa käyttäjän tilan sovellukselle.
 * Tallentaa käyttäjän ID:n ja käyttäjänimen localStorageen.
 * @param {UserProviderProps} props - Komponentin propsit
 * @returns JSX.Element
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }: UserProviderProps) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    // Ladataan käyttäjätiedot localStoragesta
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username");

        if (storedUserId && storedUsername) {
            setUserId(storedUserId);
            setUsername(storedUsername);
        }
    }, []);

    /**
     * Asettaa käyttäjätiedot ja tallentaa ne localStorageen.
     * @param {string} id - Käyttäjän ID
     * @param {string} name - Käyttäjän käyttäjänimi
     */
    const setUser = (id: string, name: string) => {
        setUserId(id);
        setUsername(name);
        localStorage.setItem("userId", id);
        localStorage.setItem("username", name);
    };

    /**
     * Tyhjentää käyttäjätiedot ja poistaa ne localStoragesta.
     */
    const clearUser = () => {
        setUserId(null);
        setUsername(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
    };

    const value: UserContextType = {
        userId,
        username,
        setUser,
        clearUser
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
export type { UserContextType };