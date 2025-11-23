import { create } from 'zustand';
import { Note, Folder, Tag, ViewMode } from '@/app/types';
import { storage } from '@/app/lib/storage';

interface StoreState {
  // Data
  notes: Note[];
  folders: Folder[];
  tags: Tag[];

  // UI State
  activeNoteId: string | null;
  activeFolderId: string | null;
  activeTagId: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  sidebarCollapsed: boolean;
  isSaving: boolean;

  // Actions - Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;

  // Actions - Folders
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setActiveFolder: (id: string | null) => void;

  // Actions - Tags
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => Tag;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  setActiveTag: (id: string | null) => void;

  // Actions - UI
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  setIsSaving: (isSaving: boolean) => void;

  // Actions - Data Management
  loadData: () => void;
  initialize: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial State
  notes: [],
  folders: [],
  tags: [],
  activeNoteId: null,
  activeFolderId: null,
  activeTagId: null,
  viewMode: 'all',
  searchQuery: '',
  sidebarCollapsed: false,
  isSaving: false,

  // Notes Actions
  addNote: (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => {
      const updatedNotes = [...state.notes, newNote];
      storage.saveNotes(updatedNotes);
      return { notes: updatedNotes, activeNoteId: newNote.id };
    });

    return newNote;
  },

  updateNote: (id, updates) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      );
      storage.saveNotes(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      storage.saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
      };
    });
  },

  setActiveNote: (id) => set({ activeNoteId: id }),

  // Folders Actions
  addFolder: (folderData) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    set((state) => {
      const updatedFolders = [...state.folders, newFolder];
      storage.saveFolders(updatedFolders);
      return { folders: updatedFolders };
    });

    return newFolder;
  },

  updateFolder: (id, updates) => {
    set((state) => {
      const updatedFolders = state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      );
      storage.saveFolders(updatedFolders);
      return { folders: updatedFolders };
    });
  },

  deleteFolder: (id) => {
    set((state) => {
      // Also remove folder association from notes
      const updatedNotes = state.notes.map((note) =>
        note.folderId === id ? { ...note, folderId: null } : note
      );
      storage.saveNotes(updatedNotes);

      const updatedFolders = state.folders.filter((folder) => folder.id !== id);
      storage.saveFolders(updatedFolders);

      return {
        folders: updatedFolders,
        notes: updatedNotes,
        activeFolderId: state.activeFolderId === id ? null : state.activeFolderId,
      };
    });
  },

  setActiveFolder: (id) => set({ activeFolderId: id, viewMode: id ? 'folder' : 'all' }),

  // Tags Actions
  addTag: (tagData) => {
    const newTag: Tag = {
      ...tagData,
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    set((state) => {
      const updatedTags = [...state.tags, newTag];
      storage.saveTags(updatedTags);
      return { tags: updatedTags };
    });

    return newTag;
  },

  updateTag: (id, updates) => {
    set((state) => {
      const updatedTags = state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updates } : tag
      );
      storage.saveTags(updatedTags);
      return { tags: updatedTags };
    });
  },

  deleteTag: (id) => {
    set((state) => {
      // Remove tag from all notes
      const updatedNotes = state.notes.map((note) => ({
        ...note,
        tags: note.tags.filter((tagId) => tagId !== id),
      }));
      storage.saveNotes(updatedNotes);

      const updatedTags = state.tags.filter((tag) => tag.id !== id);
      storage.saveTags(updatedTags);

      return {
        tags: updatedTags,
        notes: updatedNotes,
        activeTagId: state.activeTagId === id ? null : state.activeTagId,
      };
    });
  },

  setActiveTag: (id) => set({ activeTagId: id, viewMode: id ? 'tag' : 'all' }),

  // UI Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setIsSaving: (isSaving) => set({ isSaving }),

  // Data Management
  loadData: () => {
    set({
      notes: storage.getNotes(),
      folders: storage.getFolders(),
      tags: storage.getTags(),
    });
  },

  initialize: () => {
    const state = get();
    if (state.notes.length === 0) {
      // Load from storage
      const notes = storage.getNotes();
      const folders = storage.getFolders();
      const tags = storage.getTags();

      set({
        notes,
        folders,
        tags,
      });
    }
  },
}));
