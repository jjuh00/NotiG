import React, { useState } from 'react';
import type { Note } from '../types/Note.ts';
import { Header, Sidebar, Footer } from '../components/PageLayout.tsx';

/**
 * Hallintasivu-komponentti.
 * Näyttää käyttäjän muistiinpanot ruudukkoasetelmassa ja sisältää haku- sekä suodatusominaisuudet.
 * @returns JSX.Element
 */
const Dashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);


    /**
     * Käsittelee hakukyselyn muutokset.
     * @param {string} query - Hakukysely
     */
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    /**
     * Käsittelee uuden muistiinpanon luomisen.
     */
    const handleCreateNote = () => {
        // TODO: Lisää logiikka uuden muistiinpanon luomiseksi
        console.log("Uusi muistiinpano luotu");
    };

    /**
     * Käsittelee muistiinpanon muokkauksen.
     * @param {string} noteId - Muokattavan muistiinpanon ID
     */
    const handleEditNote = (noteId: string) => {
        // TODO: Lisää logiikka muistiinpanon muokkaamiseksi
        console.log("Muistiinpanon muokkaaminen:", noteId);
    };

    /**
     * Käsittelee muistiinpanon poistamisen.
     * @param {string} noteId - Poistettavan muistiinpanon ID
     */
    const handleDeleteNote = (noteId: string) => {
        // TODO: Lisää logiikka muistiinpanon poistamiseksi
        console.log("Muistiinpanon poistaminen:", noteId);
    };
    
    /**
     * Muotoilee päivämäärän luettavampaan muotoon.
     * @param {string | Date} date - Muotoiltava päivämäärä
     * @return {string} Muotoiltu päivämäärä
     */
    const formatDate = (date: string | Date): string => {
        return new Intl.DateTimeFormat("fi-FI", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }).format(new Date(date));
    };

    return (
        <div className="notig-dashboard">
            <Header onSearch={handleSearch} />
            <div className="dashboard-content">
                <Sidebar 
                    notes={notes}
                    onNoteSelected={handleEditNote}
                />

                <main className="dashboard-main">
                    <div className="content-header">
                        <button className="create-note-button" onClick={handleCreateNote}>
                            <i className="fi fi-rr-add"></i>
                        </button>
                    </div>

                    {/* Jos käyttäjä ei ole vielä tehnyt muistiinpanoja, näytetään käyttäjälle kuvitus ja viesti */}
                    {notes.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-illustration">
                                <svg className="illustration">
                                    <rect className="illustration-rect" />
                                    <line className="illustration-line-1" />
                                    <line className="illustration-line-2" />
                                    <line className="illustration-line-3" />
                                    <circle className="illustration-circle" />
                                    <path className="illustration-path" />
                                </svg>
                            </div>
                            <h2 className="empty-state-title">Ei vielä muistiinpanoja</h2>
                            <p className="empty-state-message">Luo ensimmäinen muistiinpanosi nyt!</p>
                            <button className="create-note-button" onClick={handleCreateNote}>
                                <i className="fi fi-rr-add"></i>
                            </button>
                        </div>
                    ) : (
                        // Muistiinpanot ruudukkoasetelmassa, jos käyttäjä on tehnyt muistiinpanoja
                        <div className="notes-grid">
                            {notes.map((note) => (
                                <div key={note.id} className="note-card">
                                    <div className="note-card-header">
                                        <h3 className="note-title">{note.title}</h3>
                                        <div className="note-actions">
                                            <button
                                                className="note-button"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <i className="fi fi-rr-menu-dots-vertical"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="note-card-preview">{note.preview}</p>
                                    <div className="note-card-footer">
                                        <span className="note-date">
                                            {formatDate(note.lastModified)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;