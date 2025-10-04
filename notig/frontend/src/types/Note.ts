export interface Note {
    id: string;
    title: string;
    preview: string;
    lastModified: string | Date;
    isPinned: boolean;
}