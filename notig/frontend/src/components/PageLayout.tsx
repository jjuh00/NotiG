import React, { useState } from 'react';
import type { Note } from '../../types/Note.ts';
import "../styles/page-layout.css";

// Header-propsit
interface HeaderProps {
    onSearch: (query: string) => void;
}

// Sidebar-propsit
interface SidebarProps {
    notes: Note[];
    onNoteSelected: (noteId: string) => void;
}

/**
 * Header-komponentti, joka sisältää sovelluksen nimen, hakupalkin ja käyttäjämenun.
 * @param {HeaderProps} props - Komponentin propsit
 * @returns JSX.Element
 */
const Header: React.FC<HeaderProps> = ({ onSearch }: HeaderProps) => {
    const [searchString, setSearchString] = useState<string>('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    }

    /**
     * Käsittelee navigoinnin käyttäjäasetuksiin.
     */
    const handleSettings = () => {
        // TODO: Lisää navigointilogiikka käyttäjäasetuksiin
        console.log("Navigoidaan käyttäjäasetuksiin");
    }

    /**
     * Käsittelee käyttäjän uloskirjautumisen.
     */
    const handleLogout = () => {
        // TODO: Lisää uloskirjautumislogiikka
        console.log("Uloskirjautuminen onnistui");
    };

    return (
        <header className="notig-header">
            <div className="header-left">
                <h1 className="notig-title">NotiG</h1>
            </div>

            <div className="header-center">
                <div className="search-bar">
                    <input 
                        type="text"
                        value={searchString}
                        onChange={(e) => { setSearchString(e.target.value); onSearch(e.target.value); }}
                        className="search-input"
                        placeholder="Hae muistiinpanoja..."
                    />
                </div>
            </div>

            <div className="header-right">
                <div className="usermenu">
                    <button className="usermenu-toggle" onClick={toggleUserMenu}>
                        <i className="fi fi-sr-menu-burger"></i>
                    </button>

                    {isUserMenuOpen && (
                        <div className="usermenu-dropdown">
                            <button className="usermenu-item" onClick={handleSettings}>
                                <span>Asetukset</span>
                            </button>
                            <button className="usermenu-item" onClick={handleLogout}>
                                <span>Kirjaudu ulos</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

/**
 * Sidebar-komponentti, joka näyttää kaikki muistiinpanot ja kiinnitetyt muistiinpanot.
 * @param {SidebarProps} props - Komponentin propsit
 * @returns JSX.Element
 */
const Sidebar: React.FC<SidebarProps> = ({ notes, onNoteSelected }: SidebarProps) => {
    const [activeTab, setActiveTab] = useState<"Kaikki" | "Kiinnitetyt">("Kaikki");

    // Suodatetaan kiinnitetyt muistiinpanot
    const pinnedNotes = notes.filter(note => note.isPinned);
    const displayNotes = activeTab === "Kiinnitetyt" ? pinnedNotes : notes;

    /**
     * Käsittelee muistiinpanon valinnan.
     * @param {string} noteId - Valitun muistiinpanon ID
     */
    const handleNoteSelect = (noteId: string) => {
        onNoteSelected(noteId);
    }

    return (
        <aside className="notig-sidebar">
            <div className="sidebar-tabs">
                <button 
                    className={`tab-button ${activeTab === "Kaikki" ? "active" : ''}`}
                    onClick={() => setActiveTab("Kaikki")}
                >
                    Kaikki
                </button>
                <button 
                    className={`tab-button ${activeTab === "Kiinnitetyt" ? "active" : ''}`}
                    onClick={() => setActiveTab("Kiinnitetyt")}
                >
                    Kiinnitetyt
                </button>
            </div>

            <div className="sidebar-notes-list">
                {displayNotes.map((note) => (
                    <div
                        key={note.id}
                        className="sidebar-note-item"
                        onClick={() => handleNoteSelect(note.id)}
                    >
                        <div className="sidebar-note-header">
                            <span className="sidebar-note-title">{note.title}</span>
                            {note.isPinned && (
                                <i className="fi fi-ss-thumbtack pin-icon"></i>
                            )}
                        </div>
                        <p className="sidebar-note-preview">{note.preview}</p>
                    </div>
                ))}
            </div>
        </aside>
    );
}

/**
 * Footer-komponentti, joka sisältää sovelluksen version ja tekijänoikeustiedot.
 * @returns JSX.Element
 */
const Footer: React.FC = () => {
    const appVersion = "1.1.1"; // TODO: Hae package.json:sta

    return (
        <footer className="notig-footer">
            <span>NotiG &copy; 2025. v.{appVersion}-beta</span>
        </footer>
    );
}

export { Header, Sidebar, Footer };