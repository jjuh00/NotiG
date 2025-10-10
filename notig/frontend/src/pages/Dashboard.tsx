import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import type { Note } from '../types/Note.ts';
import { Header, Sidebar, Footer } from '../components/PageLayout.tsx';
import { getUserNotes, updateNote, deleteNote, exportNoteAsPdf } from '../api/noteService.ts';
import useUser from '../hooks/useUser.ts';
import '../styles/dashboard.css';

/**
 * Hallintasivu-komponentti.
 * Näyttää käyttäjän muistiinpanot ruudukkoasetelmassa ja sisältää haku- sekä suodatusominaisuudet.
 * @returns JSX.Element
 */
const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteMenuId, setNoteMenuId] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            loadNotes();
        }
    }, [userId]);

    /**
     * Lataa käyttäjän muistiinpanot palvelimelta.
     * @param {string} [search] - Hakukysely (valinnainen)
     */
    const loadNotes = async (search: string = '') => {
        try {
            const fetchedNotes = await getUserNotes(userId!, search);
            setNotes(fetchedNotes);
            if (search && fetchedNotes.length === 0) {
                alert(`Ei löytynyt muistiinpanoja hakusanalla ${search}`);
            }
        } catch (error) {
            console.error("Muistiinpanojen latausvirhe:", error);
            alert("Muistiinpanojen lataus epäonnistui");
            setNotes([]);
        }
    };

    /**
     * Käsittelee hakulomakkeen lähetyksen.
     * @param {FormEvent<HTMLFormElement>} e - Lomakkeen tapahtuma
     */
    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            alert("Hakukenttä ei voi olla tyhjä");
            return;
        }
        loadNotes(searchQuery);
    };

    /**
     * Käsittelee hakukentän tyhjentämisen.
     */
    const handleClearSearch = () => {
        setSearchQuery('');
        loadNotes();
    };

    /**
     * Käsittelee navigoinnin uuden muistiinpanon luomiseen.
     */
    const handleCreateNote = () => {
        navigate("/note/new");
    };

    /**
     * Käsittelee muistiinpanon kiinnittämisen ja kiinnityksen poistamisen.
     * @param {string} noteId - Muistiinpanon ID
     * @param {boolean} isPinned - Onko muistiinpano kiinnitetty
     */
    const handlePinNote = async (noteId: string, isPinned: boolean) => {
        try {
            setNoteMenuId(null);
            await updateNote(noteId, { isPinned: !isPinned });
            await loadNotes();
        } catch (error) {
            console.error("Muistiinpanon kiinnitysvirhe:", error);
        }
    };

    /**
     * Käsittelee muistiinpanon muokkauksen.
     * @param {string} noteId - Muokattavan muistiinpanon ID
     */
    const handleEditNote = (noteId: string) => {
        setNoteMenuId(null);
        navigate(`/note/${noteId}`);
    };

    /**
     * Käsittelee muistiinpanon poistamisen.
     * @param {string} noteId - Poistettavan muistiinpanon ID
     */
    const handleDeleteNote = async (noteId: string) => {
        if (confirm("Haluatko varmasti poistaa tämän muistiinpanon?")) {
            try {
                setNoteMenuId(null);
                await deleteNote(noteId);
                await loadNotes();
            } catch (error) {
                console.error("Muistiinpanon poistamisvirhe:", error);
            }
        }
    };

    /**
     * Käsittelee muistiinpanon viennin PDF-muotoon.
     * @param {Note} note - Muistiinpano, joka viedään PDF-muotoon
     */
    const handleExportPdf = async (note: Note) => {
        try {
            setNoteMenuId(null);

            const pdfBlob = await exportNoteAsPdf(note.id);

            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${note.title}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Muistiinpanon PDF-vientivirhe:", error);
        }
    };
    
    /**
     * Muotoilee päivämäärän luettavampaan muotoon.
     * @param {string | Date} date - Muotoiltava päivämäärä
     * @returns {string} Muotoiltu päivämäärä
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
            <Header 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearchSubmit}
                onClearSearch={handleClearSearch}
            />
            <div className="dashboard-content">
                <Sidebar 
                    notes={notes}
                    onNoteSelected={handleEditNote}
                />

                <main className="dashboard-main">
                    <div className="content-header">
                        <h1>Muistiinpanot</h1>
                        <button className="create-note-button" onClick={handleCreateNote}>
                            <i className="fi fi-rr-add"></i>
                        </button>
                    </div>

                    {/* Jos käyttäjä ei ole vielä tehnyt muistiinpanoja, näytetään käyttäjälle kuvitus ja viesti */}
                    {notes.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-illustration">
                                <svg>
                                    <line x1="60" y1="60" x2="140" y2="60" />
                                    <line x1="60" y1="80" x2="140" y2="80" />
                                    <line x1="60" y1="100" x2="120" y2="100" />
                                    <circle />
                                    <path d="M 100 120 L 100 140 M 90 130 L 110 130" />
                                </svg>
                            </div>
                            <h2>Ei vielä muistiinpanoja</h2>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNoteMenuId(noteMenuId === note.id ? null : note.id);
                                                }}
                                            >
                                                <i className="fi fi-rr-menu-dots-vertical"></i>
                                            </button>
                                            {noteMenuId === note.id && (
                                                <div className="note-menu">
                                                    <button onClick={() => handlePinNote(note.id, note.isPinned)}>
                                                        {note.isPinned ? "Poista kiinnitys" : "Kiinnitä"}
                                                    </button>
                                                    <button onClick={() => handleEditNote(note.id)}>Muokkaa</button>
                                                    <button onClick={() => handleDeleteNote(note.id)}>Poista</button>
                                                    <button onClick={() => handleExportPdf(note)}>Vie PDF:ksi</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="note-card-preview">{note.preview}</p>
                                    <div className="note-card-footer">
                                        <span className="note-date">
                                            {formatDate(note.lastModified!)}
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