export interface Note {
  id: string;
  title: string;
  content: string; // JSON string of Tiptap document
  folderId: string | null;
  tags: string[];
  isFavorited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  icon: string;
  color: string;
  position: number;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export type ViewMode = 'all' | 'folder' | 'favorites' | 'recent' | 'tag';

export type Theme = 'dark' | 'light';

export interface AppState {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  activeNoteId: string | null;
  activeFolderId: string | null;
  activeTagId: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  sidebarCollapsed: boolean;
}
