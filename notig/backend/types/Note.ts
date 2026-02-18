export interface Note {
    id?: string;
    userId?: string;
    title: string;
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isPinned: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export type NoteUpdate = Partial<Note>;