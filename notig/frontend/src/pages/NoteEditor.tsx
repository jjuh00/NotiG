import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUser from '../hooks/useUser.ts';
import { createNote, getNote, updateNote } from '../api/noteService.ts';
import '../styles/note-editor.css';

/**
 * Komponentti muistiinpanon luomista (ja muokkausta) varten.
 * Mahdollistaa otsikon, sisällön ja tyylien määrittämisen muistiinpanoon.
 * @returns JSX.Element
 */
const NoteEditor: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const { noteId } = useParams<{ noteId: string }>();
    const isNew = noteId === "new";
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [fontFamily, setFontFamily] = useState<string>("Inter");
    const [fontSize, setFontSize] = useState<number>(16);
    const [color, setColor] = useState<string>("whitesmoke");
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    /**
     * Lataa olemassa olevan muistiinpanon tiedot, jos muokataan vanhaa muistiinpanoa.
     */
    useEffect(() => {
        if (!isNew) {
            loadNote();
        }
    }, [noteId]);

    /**
     * Lataa olemassa olevan muistiinpanon tiedot.
     */
    const loadNote = async () => {
        try {
            const note = await getNote(noteId!);
            setTitle(note.title);
            setContent(note.content || '');
            setFontFamily(note.fontFamily);
            setFontSize(note.fontSize);
            setColor(note.color);
            setIsBold(note.isBold);
            setIsItalic(note.isItalic);
            setIsUnderline(note.isUnderline);
        } catch (error) {
            console.error("Muistiinpanon latausvirhe:", error);
            setError("Muistiinpanon lataus epäonnistui");
        }
    };

    /**
     * Käsittelee muistiinpanon tallentamisen.
     */
    const handleSaveClick = async () => {
        if (!title.trim()) {
            setError("Muistiinpanolla täytyy olla otsikko");
            return;
        }

        setError('');

        try {
            const noteData = {
                title,
                content,
                fontFamily: fontFamily,
                fontSize: fontSize,
                color,
                isBold: isBold,
                isItalic: isItalic,
                isUnderline: isUnderline
            };

            if (isNew) {
                await createNote({ ...noteData, userId: userId! });
            } else {
                await updateNote(noteId!, noteData);
            }
            navigate("/dashboard");
        } catch (error) {
            console.error("Muistiinpanon tallennusvirhe:", error);
            setError("Muistiinpanon tallennus epäonnistui");
        }
    };

    /**
     * Käsittelee muistiinpanon peruutuksen.
     */
    const handleCancelClick = () => {
        navigate("/dashboard");
    };

    return (
        <div className="note-editor">
            <div className="editor-header">
                <h1>{isNew ? "Uusi muistiinpano" : "Muokkaa muistiinpanoa"}</h1>
            </div>

            <div className="editor-controls">
                {/* Fontin valinta */}
                <select
                    className="editor-select"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                >
                    <option value="Inter">Inter</option>
                    <option value="JetBrains Mono">JetBrains Mono</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lora">Lora</option>
                </select>

                {/* Fontin koon valinta */}
                <select
                    className="editor-select"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                >
                    {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                        <option key={size} value={size}>{size}px</option>
                    ))}
                </select>

                {/* Tekstin värin valinta */}
                <select
                    className="editor-select"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                >
                    <option value="white">Valkoinen</option>
                    <option value="black">Musta</option>
                    <option value="red">Punainen</option>
                    <option value="green">Vihreä</option>
                    <option value="blue">Sininen</option>
                    <option value="yellow">Keltainen</option>
                    <option value="orange">Oranssi</option>
                    <option value="gray">Harmaa</option>
                    <option value="black">Musta</option>
                </select>

                {/* Tekstin tyyli (lihavointi, kursivointi, alleviivaus) */}
                <button className={`editor-toggle ${isBold ? "active": ''}`} onClick={() => setIsBold(!isBold)}>
                    <i className="fi fi-br-bold"></i>
                </button>
                <button className={`editor-toggle ${isItalic ? "active": ''}`} onClick={() => setIsItalic(!isItalic)}>
                    <i className="fi fi-br-italic"></i>
                </button>
                <button className={`editor-toggle ${isUnderline ? "active": ''}`} onClick={() => setIsUnderline(!isUnderline)}>
                    <i className="fi fi-br-underline"></i>
                </button>
            </div>

            <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="editor-title" 
                placeholder="Otsikko"
                maxLength={40}           
            />

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="editor-content"
                placeholder="Kirjoita muistiinpano tähän..."
                style={{
                    fontFamily,
                    fontSize,
                    color,
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                    textDecoration: isUnderline ? "underline" : "none"
                }}
            />

            {error && <div className="error-message">{error}</div>}

            <div className="editor-buttons">
                <button className="cancel-button" onClick={handleCancelClick}>
                    <i className="fi fi-br-cross"></i>
                </button>
                <button className="save-button" onClick={handleSaveClick}>
                    <i className="fi fi-br-check"></i>
                </button>
            </div>
        </div>
    );
}

export default NoteEditor;