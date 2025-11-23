'use client';

import { useEffect } from 'react';
import { useStore } from '@/app/store/useStore';

interface UseKeyboardShortcutsProps {
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts({ onFocusSearch }: UseKeyboardShortcutsProps = {}) {
  const {
    notes,
    activeNoteId,
    addNote,
    updateNote,
    deleteNote,
    setActiveNote,
    toggleSidebar,
    setSearchQuery,
    searchQuery,
    viewMode,
    activeFolderId,
    activeTagId,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect if on Mac
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ignore shortcuts when typing in input/textarea (except Esc)
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd/Ctrl + N: Create new note
      if (modKey && e.key === 'n' && !isTyping) {
        e.preventDefault();
        addNote({
          title: 'Untitled Note',
          content: JSON.stringify({
            type: 'doc',
            content: [{ type: 'paragraph', content: [] }],
          }),
          folderId: null,
          tags: [],
          isFavorited: false,
        });
        return;
      }

      // Cmd/Ctrl + K: Focus search
      if (modKey && e.key === 'k') {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }

      // Cmd/Ctrl + B: Toggle sidebar
      if (modKey && e.key === 'b' && !isTyping) {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Cmd/Ctrl + F: Toggle favorite on active note
      if (modKey && e.key === 'f' && !isTyping) {
        e.preventDefault();
        if (activeNoteId) {
          const activeNote = notes.find((n) => n.id === activeNoteId);
          if (activeNote) {
            updateNote(activeNoteId, { isFavorited: !activeNote.isFavorited });
          }
        }
        return;
      }

      // Cmd/Ctrl + Delete/Backspace: Delete active note
      if (modKey && (e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        e.preventDefault();
        if (activeNoteId) {
          const activeNote = notes.find((n) => n.id === activeNoteId);
          if (activeNote && confirm(`Delete "${activeNote.title}"?`)) {
            deleteNote(activeNoteId);
          }
        }
        return;
      }

      // Esc: Clear search or deselect note
      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
        } else if (activeNoteId) {
          setActiveNote(null);
        }
        return;
      }

      // Arrow Up/Down: Navigate notes (only when not typing)
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !isTyping) {
        e.preventDefault();

        // Filter notes based on current view
        const filteredNotes = notes.filter((note) => {
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return (
              note.title.toLowerCase().includes(searchLower) ||
              note.content.toLowerCase().includes(searchLower)
            );
          }
          if (viewMode === 'favorites') return note.isFavorited;
          if (viewMode === 'folder' && activeFolderId) return note.folderId === activeFolderId;
          if (viewMode === 'tag' && activeTagId) return note.tags.includes(activeTagId);
          return true;
        });

        // Sort by updatedAt
        const sortedNotes = filteredNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        if (sortedNotes.length === 0) return;

        const currentIndex = activeNoteId ? sortedNotes.findIndex((n) => n.id === activeNoteId) : -1;

        if (e.key === 'ArrowDown') {
          // Move to next note
          const nextIndex = currentIndex < sortedNotes.length - 1 ? currentIndex + 1 : 0;
          setActiveNote(sortedNotes[nextIndex].id);
        } else if (e.key === 'ArrowUp') {
          // Move to previous note
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : sortedNotes.length - 1;
          setActiveNote(sortedNotes[prevIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    notes,
    activeNoteId,
    addNote,
    updateNote,
    deleteNote,
    setActiveNote,
    toggleSidebar,
    setSearchQuery,
    searchQuery,
    viewMode,
    activeFolderId,
    activeTagId,
    onFocusSearch,
  ]);
}
