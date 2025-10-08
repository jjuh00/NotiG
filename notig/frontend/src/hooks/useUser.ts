import { useContext } from 'react';
import { UserContext } from '../context/UserContext.tsx';

/**
 * Hookki käyttäjätiedon käyttämiseen kontekstista.
 * @returns {UserContextType} - Käyttäjätiedot ja toiminnot
 */
const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser täytyy olla UserProviderin sisällä");
    }
    return context;
};

export default useUser;