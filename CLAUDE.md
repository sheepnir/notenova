# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NoteNova is a beautiful, AI-powered note-taking application featuring the **Cosmic Night** theme. This is a **front-end demo** built with Next.js 16 App Router, using LocalStorage for data persistence (no backend). The PRD for the full product is at `/Users/nirsheep/Developer/ClaudeCode_Test/note-taking-app-prd.md`.

**Tech Stack:**
- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4 (new inline theme syntax)
- Tiptap (ProseMirror-based rich text editor)
- Zustand (state management)
- Lucide React (icons)

## Development Commands

```bash
# Start development server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### State Management (Zustand)

**Central Store:** `app/store/useStore.ts`

The entire application state is managed through a single Zustand store that handles:
- Notes, folders, and tags (data)
- Active selections (activeNoteId, activeFolderId, activeTagId)
- View modes ('all', 'folder', 'favorites', 'recent', 'tag')
- UI state (searchQuery, sidebarCollapsed)

**Key Pattern:** All CRUD operations automatically sync with LocalStorage:
```typescript
// Example: Adding a note updates both state and LocalStorage
addNote: (noteData) => {
  const newNote = { ...noteData, id: generateId(), ... };
  set((state) => {
    const updatedNotes = [...state.notes, newNote];
    storage.saveNotes(updatedNotes); // ← Auto-persist
    return { notes: updatedNotes };
  });
}
```

### Data Storage (LocalStorage)

**Module:** `app/lib/storage.ts`

Three storage keys:
- `notenova_notes` - Note content (JSON), includes Tiptap document structure
- `notenova_folders` - Folder hierarchy and metadata
- `notenova_tags` - Tag definitions

**Sample Data:** `initializeSampleData()` creates 3 notes, 3 folders, 3 tags on first load.

**Important:** All dates are serialized/deserialized when saving/loading.

### Component Architecture

**Three-column layout:**
1. **Sidebar** (`components/layout/Sidebar.tsx`) - Navigation, folders, tags
2. **NoteList** (`components/layout/NoteList.tsx`) - Filtered list of notes based on viewMode
3. **Editor** (`components/editor/Editor.tsx`) - Tiptap editor with toolbar

**Data Flow:**
```
User Action → Zustand Action → State Update → LocalStorage Sync → UI Re-render
```

### Tiptap Editor Integration

**Critical SSR Fix:** The editor MUST include `immediatelyRender: false` to avoid Next.js hydration errors:

```typescript
const editor = useEditor({
  immediatelyRender: false, // ← Required for Next.js App Router
  extensions: [...],
});
```

**Note Content Format:** Notes are stored as stringified Tiptap JSON documents:
```typescript
{
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [...] },
    { type: 'paragraph', content: [...] }
  ]
}
```

**Auto-save:** Debounced 500ms after each edit, updates both state and LocalStorage.

## Cosmic Night Theme

**Design System:** All theme colors defined in `app/globals.css` using CSS custom properties.

**Tailwind v4 Syntax:** Uses the new `@theme inline` directive for Tailwind integration:

```css
@theme inline {
  --color-violet-primary: #7c3aed;
  /* ... */
}
```

**Accessing Colors in Components:**
```tsx
// Use CSS variables directly in Tailwind classes
className="bg-[var(--color-violet-primary)]"
className="text-[var(--color-white-muted)]"
```

**Pre-defined Utility Classes:**
- `.glass` - Glassmorphism effect (background blur)
- `.card` - Elevated surface card style
- `.glow-violet`, `.glow-pink` - Glow effects

## Key TypeScript Interfaces

**Location:** `app/types/index.ts`

```typescript
interface Note {
  id: string;
  title: string;
  content: string; // Stringified Tiptap JSON
  folderId: string | null;
  tags: string[]; // Array of tag IDs
  isFavorited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null; // For nesting
  icon: string; // Emoji
  color: string; // Hex color
  position: number; // Sort order
  createdAt: Date;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

type ViewMode = 'all' | 'folder' | 'favorites' | 'recent' | 'tag';
```

## Common Patterns

### Adding a New Feature Component

1. Create component in `app/components/[category]/`
2. If it needs global state, use `useStore()` hook
3. Apply Cosmic Night theme colors via CSS variables
4. Use Lucide React for icons

### Modifying the Editor

**Editor extensions:** `app/components/editor/Editor.tsx`
**Toolbar:** `app/components/editor/EditorToolbar.tsx`
**Styling:** `app/components/editor/editor.css`

Add new Tiptap extensions to the `extensions` array in `useEditor()`.

### Working with Notes

**Filter logic:** See `NoteList.tsx` - filters are applied based on:
- `searchQuery` (title + content search)
- `viewMode` (all, favorites, folder, tag, recent)
- `activeFolderId` or `activeTagId`

**Creating notes:**
```typescript
const { addNote } = useStore();
addNote({
  title: 'New Note',
  content: JSON.stringify({ type: 'doc', content: [...] }),
  folderId: null,
  tags: [],
  isFavorited: false,
});
```

## Known Limitations (Front-end Demo)

- No backend (all data in LocalStorage)
- No authentication
- No cloud sync
- AI features are UI placeholders only
- Data limited to single browser/device

## Future Backend Integration Points

When adding a backend, replace:
1. `app/lib/storage.ts` → API calls
2. LocalStorage → Database (Supabase/Firebase recommended)
3. Zustand actions → Add async operations with loading states
4. `initializeSampleData()` → Server-side seeding

The Zustand store structure is already designed to easily swap LocalStorage for API calls.

Claude Code Rules:
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY


CRITICAL: When debugging, you MUST trace through the ENTIRE code flow step by step. No assumptions. No shortcuts.