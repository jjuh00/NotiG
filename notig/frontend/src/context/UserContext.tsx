import { createContext, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';

interface UserContextType {
    userId: string | null;
    username: string | null;
    setUser: (userId: string, username: string) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType>({
    userId: null,
    username: null,
    setUser: () => {},
    clearUser: () => {}
});

/**
 * UserProvider-komponentti, joka tarjoaa käyttäjän tilan sovellukselle.
 * Tallentaa käyttäjän ID:n ja käyttäjänimen localStorageen.
 * @param {PropsWithChildren<{}>} props - Komponentin propsit
 * @returns JSX.Element
 */
const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }: PropsWithChildren<{}>) => {
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

    return <UserContext.Provider value={{
        userId,
        username,
        setUser,
        clearUser
    }}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };