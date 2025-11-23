'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/useStore';
import { initializeSampleData } from './lib/storage';
import Sidebar from './components/layout/Sidebar';
import TopBar, { TopBarRef } from './components/layout/TopBar';
import NoteList from './components/layout/NoteList';
import Editor from './components/editor/Editor';
import ConfirmDialog from './components/ui/ConfirmDialog';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function Home() {
  const { initialize, deleteNote } = useStore();
  const topBarRef = useRef<TopBarRef>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; title: string } | null>(null);

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => topBarRef.current?.focusSearch(),
    onDeleteNote: (noteId, noteTitle) => setDeleteConfirmation({ id: noteId, title: noteTitle }),
  });

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteNote(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    // Load data from localStorage
    initialize();
  }, [initialize]);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[var(--color-space-dark)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar ref={topBarRef} />

        {/* Content: Note List + Editor */}
        <div className="flex-1 flex overflow-hidden">
          <NoteList />
          <Editor />
        </div>
      </div>

      {/* Global Delete Confirmation Dialog (for keyboard shortcut) */}
      <ConfirmDialog
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteConfirmation?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
