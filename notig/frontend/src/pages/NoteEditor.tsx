import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser.ts';
import { createNote } from '../api/noteService.ts';
import "../styles/note-editor.css";

/**
 * Komponentti muistiinpanon luomista (ja muokkausta) varten.
 * Mahdollistaa otsikon, sisällön ja tyylien määrittämisen muistiinpanoon.
 * @returns JSX.Element
 */
const NoteEditor: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [fontFamily, setFontFamily] = useState<string>("Inter");
    const [fontSize, setFontSize] = useState<number>(16);
    const [color, setColor] = useState<string>("whitesmoke");
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Käsittelee muistiinpanon tallentamisen.
     */
    const handleSaveClick = async () => {
        if (!title.trim()) {
            setError("Muistiinpanolla täytyy olla otsikko");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await createNote({
                userId: userId!,
                title,
                content,
                fontFamily,
                fontSize,
                color,
                isBold,
                isItalic,
                isUnderline
            });

            if (response.status === "created") {
                navigate("/dashboard");
            } else {
                setError("Muistiinpanon luonti epäonnistui: " + response.message);
            }
        } catch (error) {
            console.error("Muistiinpanon tallentamisessa ilmeni virhe:", error);
            setError("Muistiinpanon luonti epäonnistui");
        } finally {
            setLoading(false);
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
                <h1>Uusi muistiinpano</h1>
            </div>

            <div className="editor-controls">
                {/* Fontin valinta */}
                <select
                    className="editor-select"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                disabled={loading}
            />

            {error && <div className="error-message">{error}</div>}

            <div className="editor-buttons">
                <button className="cancel-button" onClick={handleCancelClick} disabled={loading}>
                    <i className="fi fi-br-cross"></i>
                </button>
                <button className="save-button" onClick={handleSaveClick} disabled={loading}>
                    <i className="fi fi-br-check"></i>
                </button>
            </div>
        </div>
    );
}

export default NoteEditor;