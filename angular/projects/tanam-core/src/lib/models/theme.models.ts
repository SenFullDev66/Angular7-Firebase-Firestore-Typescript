export type AdminTheme = 'default' | 'light' | 'dark';

export const THEMES = {
    'default': 'tanam-light-theme',
    'light': 'tanam-light-theme',
    'dark': 'tanam-dark-theme',
};

export interface ContentTemplate {
    id: string;
    theme: string;
    title: string;
    selector: string;
    template: string;
    styles: string[];
    updatedAt: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    createdAt: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface TanamTheme {
    id: string;
    title: string;
    description: string;
    images: string[];
    styles: string[];
    updatedAt: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    createdAt: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}
