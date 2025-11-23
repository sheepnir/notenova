'use client';

import { useState } from 'react';
import { useStore } from '@/app/store/useStore';
import { Star, Tag, Folder, Trash2 } from 'lucide-react';
import { Note } from '@/app/types';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function NoteList() {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const {
    notes,
    folders,
    tags,
    activeNoteId,
    activeFolderId,
    activeTagId,
    viewMode,
    searchQuery,
    setActiveNote,
    updateNote,
    deleteNote,
  } = useStore();

  // Filter notes based on view mode and search
  const filteredNotes = notes.filter((note) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = note.title.toLowerCase().includes(searchLower);
      const contentMatch = note.content.toLowerCase().includes(searchLower);
      if (!titleMatch && !contentMatch) return false;
    }

    // View mode filter
    if (viewMode === 'favorites') {
      return note.isFavorited;
    }

    if (viewMode === 'folder' && activeFolderId) {
      return note.folderId === activeFolderId;
    }

    if (viewMode === 'tag' && activeTagId) {
      return note.tags.includes(activeTagId);
    }

    if (viewMode === 'recent') {
      return true; // Will be sorted by date
    }

    if (viewMode === 'all') {
      return true;
    }

    return true;
  });

  // Sort notes
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (viewMode === 'recent') {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const handleToggleFavorite = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    updateNote(note.id, { isFavorited: !note.isFavorited });
  };

  const handleDelete = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToDelete(note);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setNoteToDelete(null);
    }
  };

  const getViewTitle = () => {
    if (viewMode === 'favorites') return 'Favorites';
    if (viewMode === 'recent') return 'Recent Notes';
    if (viewMode === 'folder' && activeFolderId) {
      const folder = folders.find((f) => f.id === activeFolderId);
      return folder ? `${folder.icon} ${folder.name}` : 'Folder';
    }
    if (viewMode === 'tag' && activeTagId) {
      const tag = tags.find((t) => t.id === activeTagId);
      return tag ? `#${tag.name}` : 'Tag';
    }
    return 'All Notes';
  };

  return (
    <div className="w-80 border-r border-[rgba(196,181,253,0.1)] bg-[var(--color-space-dark)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(196,181,253,0.1)]">
        <h2 className="text-xl font-semibold text-[var(--color-white-primary)]">{getViewTitle()}</h2>
        <p className="text-sm text-[var(--color-white-muted)] mt-1">
          {sortedNotes.length} {sortedNotes.length === 1 ? 'note' : 'notes'}
        </p>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto">
        {sortedNotes.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-white-muted)]">
            <p>No notes found</p>
            <p className="text-sm mt-2">Create your first note to get started!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={note.id === activeNoteId}
                onClick={() => setActiveNote(note.id)}
                onToggleFavorite={(e) => handleToggleFavorite(note, e)}
                onDelete={(e) => handleDelete(note, e)}
                folder={folders.find((f) => f.id === note.folderId)}
                noteTags={tags.filter((t) => note.tags.includes(t.id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  folder?: { name: string; icon: string };
  noteTags: { name: string; color: string }[];
}

function NoteCard({ note, isActive, onClick, onToggleFavorite, onDelete, folder, noteTags }: NoteCardProps) {
  // Extract preview text from content
  const getPreview = () => {
    try {
      const content = JSON.parse(note.content);
      const firstParagraph = content.content?.find((node: any) => node.type === 'paragraph');
      if (firstParagraph && firstParagraph.content) {
        const text = firstParagraph.content.map((c: any) => c.text).join('');
        return text || 'No content';
      }
      return 'No content';
    } catch {
      return 'No content';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={`group p-4 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'bg-[var(--color-space-elevated)] border border-[var(--color-violet-primary)]'
          : 'hover:bg-[rgba(255,255,255,0.03)] border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-[var(--color-white-primary)] flex-1 truncate">{note.title}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleFavorite}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[rgba(255,255,255,0.1)] rounded transition-all"
          >
            <Star
              size={14}
              className={note.isFavorited ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-white-muted)]'}
            />
          </button>
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[rgba(255,255,255,0.1)] rounded transition-all"
          >
            <Trash2 size={14} className="text-[var(--color-error)]" />
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--color-white-muted)] line-clamp-2 mb-2">{getPreview()}</p>

      <div className="flex items-center justify-between text-xs text-[var(--color-white-muted)]">
        <div className="flex items-center gap-2">
          {folder && (
            <span className="flex items-center gap-1">
              <span>{folder.icon}</span>
              <span>{folder.name}</span>
            </span>
          )}
          {noteTags.length > 0 && (
            <div className="flex items-center gap-1">
              {noteTags.slice(0, 2).map((tag) => (
                <span key={tag.name} className="flex items-center gap-0.5" style={{ color: tag.color }}>
                  <Tag size={10} />
                  {tag.name}
                </span>
              ))}
              {noteTags.length > 2 && <span>+{noteTags.length - 2}</span>}
            </div>
          )}
        </div>
        <span>{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
}
