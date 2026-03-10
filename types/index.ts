export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isArchived: boolean;
  isFavorite: boolean;
  color?: string;
}

export interface AIResponse {
  summary?: string;
  suggestions?: string[];
  tags?: string[];
  error?: string;
}

export type NoteColor = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";
