import { Note, Folder, Tag, Theme } from '@/app/types';

const STORAGE_KEYS = {
  NOTES: 'notenova_notes',
  FOLDERS: 'notenova_folders',
  TAGS: 'notenova_tags',
  THEME: 'notenova_theme',
};

// Safe localStorage access with SSR support
const isClient = typeof window !== 'undefined';

export const storage = {
  // Notes
  getNotes: (): Note[] => {
    if (!isClient) return [];
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((note: Note) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  },

  saveNotes: (notes: Note[]): void => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  // Folders
  getFolders: (): Folder[] => {
    if (!isClient) return [];
    const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((folder: Folder) => ({
      ...folder,
      createdAt: new Date(folder.createdAt),
    }));
  },

  saveFolders: (folders: Folder[]): void => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  },

  // Tags
  getTags: (): Tag[] => {
    if (!isClient) return [];
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((tag: Tag) => ({
      ...tag,
      createdAt: new Date(tag.createdAt),
    }));
  },

  saveTags: (tags: Tag[]): void => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  // Theme
  getTheme: (): Theme => {
    if (!isClient) return 'dark';
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme === 'light' || theme === 'dark') ? theme : 'dark';
  },

  saveTheme: (theme: Theme): void => {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Clear all data
  clearAll: (): void => {
    if (!isClient) return;
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.FOLDERS);
    localStorage.removeItem(STORAGE_KEYS.TAGS);
    localStorage.removeItem(STORAGE_KEYS.THEME);
  },
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  const existingNotes = storage.getNotes();
  if (existingNotes.length > 0) return;

  const sampleFolders: Folder[] = [
    {
      id: 'folder-1',
      name: 'Work',
      parentId: null,
      icon: '💼',
      color: '#7c3aed',
      position: 0,
      createdAt: new Date(),
    },
    {
      id: 'folder-2',
      name: 'Personal',
      parentId: null,
      icon: '🏠',
      color: '#ec4899',
      position: 1,
      createdAt: new Date(),
    },
    {
      id: 'folder-3',
      name: 'Ideas',
      parentId: null,
      icon: '💡',
      color: '#06b6d4',
      position: 2,
      createdAt: new Date(),
    },
  ];

  const sampleTags: Tag[] = [
    { id: 'tag-1', name: 'Important', color: '#ef4444', createdAt: new Date() },
    { id: 'tag-2', name: 'Project', color: '#7c3aed', createdAt: new Date() },
    { id: 'tag-3', name: 'Quick Note', color: '#06b6d4', createdAt: new Date() },
  ];

  const sampleNotes: Note[] = [
    {
      id: 'note-1',
      title: 'Welcome to NoteNova',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Welcome to NoteNova ✨' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'NoteNova is your beautiful, AI-powered note-taking companion. Here are some features to explore:',
              },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', marks: [{ type: 'bold' }], text: 'Rich Text Editing' },
                      { type: 'text', text: ' - Format your notes with bold, italic, headings, and more' },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', marks: [{ type: 'bold' }], text: 'Organize with Folders & Tags' },
                      { type: 'text', text: ' - Keep your notes structured and easily findable' },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', marks: [{ type: 'bold' }], text: 'Beautiful Cosmic Night Theme' },
                      { type: 'text', text: ' - Enjoy a stunning interface inspired by the cosmos' },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', marks: [{ type: 'bold' }], text: 'Auto-Save' },
                      { type: 'text', text: ' - Your notes are automatically saved as you type' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start creating your first note by clicking the + button!' }],
          },
        ],
      }),
      folderId: null,
      tags: [],
      isFavorited: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'note-2',
      title: 'Project Ideas',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Upcoming Projects' }],
          },
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Design new landing page' }],
                  },
                ],
              },
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Research AI integration options' }],
                  },
                ],
              },
              {
                type: 'taskItem',
                attrs: { checked: true },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Set up project structure' }],
                  },
                ],
              },
            ],
          },
        ],
      }),
      folderId: 'folder-1',
      tags: ['tag-2'],
      isFavorited: false,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: 'note-3',
      title: 'Quick Thoughts',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Sometimes the best ideas come when you least expect them. Always have a place to capture your thoughts!',
              },
            ],
          },
        ],
      }),
      folderId: 'folder-3',
      tags: ['tag-3'],
      isFavorited: false,
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000),
    },
  ];

  storage.saveFolders(sampleFolders);
  storage.saveTags(sampleTags);
  storage.saveNotes(sampleNotes);
};
