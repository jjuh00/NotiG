export interface Note {
    id: string;
    title: string;
    preview?: string;
    content?: string;
    lastModified?: string | Date;
    isPinned: boolean;
    fontFamily: string;
    fontSize: number;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    createdAt: string | Date;
    updatedAt?: string | Date | null;
}