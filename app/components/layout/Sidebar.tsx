'use client';

import { useState } from 'react';
import { useStore } from '@/app/store/useStore';
import {
  ChevronRight,
  Plus,
  Star,
  Clock,
  Folder,
  Tag,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import InputDialog from '../ui/InputDialog';

export default function Sidebar() {
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const {
    folders,
    tags,
    notes,
    activeFolderId,
    activeTagId,
    viewMode,
    sidebarCollapsed,
    setActiveFolder,
    setActiveTag,
    setViewMode,
    toggleSidebar,
    addFolder,
  } = useStore();

  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);

  const favoriteNotes = notes.filter((n) => n.isFavorited);
  const recentNotes = notes.slice().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

  const handleViewChange = (mode: 'all' | 'favorites' | 'recent') => {
    setViewMode(mode);
    setActiveFolder(null);
    setActiveTag(null);
  };

  const handleNewFolder = () => {
    setShowNewFolderDialog(true);
  };

  const createFolder = (name: string) => {
    addFolder({
      name,
      parentId: null,
      icon: '📁',
      color: '#7c3aed',
      position: folders.length,
    });
  };

  if (sidebarCollapsed) {
    return (
      <aside className="w-16 bg-[var(--color-space-dark)] border-r border-[rgba(196,181,253,0.1)] flex flex-col items-center py-4 gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
        >
          <Menu size={20} className="text-[var(--color-white-primary)]" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-[var(--color-space-dark)] border-r border-[rgba(196,181,253,0.1)] flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(196,181,253,0.1)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-violet-primary)] to-[var(--color-pink-accent)] rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="font-semibold text-[var(--color-white-primary)]">NoteNova</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
        >
          <X size={18} className="text-[var(--color-white-muted)]" />
        </button>
      </div>

      {/* Quick Views */}
      <div className="p-4 space-y-1">
        <SidebarItem
          icon={<Star size={18} />}
          label="All Notes"
          count={notes.length}
          active={viewMode === 'all'}
          onClick={() => handleViewChange('all')}
        />
        <SidebarItem
          icon={<Star size={18} fill="currentColor" />}
          label="Favorites"
          count={favoriteNotes.length}
          active={viewMode === 'favorites'}
          onClick={() => handleViewChange('favorites')}
        />
        <SidebarItem
          icon={<Clock size={18} />}
          label="Recent"
          count={recentNotes.length}
          active={viewMode === 'recent'}
          onClick={() => handleViewChange('recent')}
        />
      </div>

      {/* Folders */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setFoldersExpanded(!foldersExpanded)}
            className="flex items-center gap-1 text-sm text-[var(--color-white-muted)] hover:text-[var(--color-white-primary)] transition-colors"
          >
            {foldersExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span>Folders</span>
          </button>
          <button
            onClick={handleNewFolder}
            className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
          >
            <Plus size={14} className="text-[var(--color-white-muted)]" />
          </button>
        </div>
        {foldersExpanded && (
          <div className="space-y-1">
            {folders.map((folder) => {
              const folderNoteCount = notes.filter((n) => n.folderId === folder.id).length;
              return (
                <SidebarItem
                  key={folder.id}
                  icon={<span>{folder.icon}</span>}
                  label={folder.name}
                  count={folderNoteCount}
                  active={activeFolderId === folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="flex items-center gap-1 text-sm text-[var(--color-white-muted)] hover:text-[var(--color-white-primary)] transition-colors"
          >
            {tagsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span>Tags</span>
          </button>
        </div>
        {tagsExpanded && (
          <div className="space-y-1">
            {tags.map((tag) => {
              const tagNoteCount = notes.filter((n) => n.tags.includes(tag.id)).length;
              return (
                <SidebarItem
                  key={tag.id}
                  icon={<Tag size={16} />}
                  label={tag.name}
                  count={tagNoteCount}
                  active={activeTagId === tag.id}
                  onClick={() => setActiveTag(tag.id)}
                  color={tag.color}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t border-[rgba(196,181,253,0.1)]">
        <div className="text-xs text-[var(--color-white-muted)] text-center">
          <p>Cosmic Night Theme</p>
          <p className="text-[var(--color-violet-primary)]">✨ NoteNova</p>
        </div>
      </div>

      {/* New Folder Dialog */}
      <InputDialog
        isOpen={showNewFolderDialog}
        onClose={() => setShowNewFolderDialog(false)}
        onConfirm={createFolder}
        title="Create Folder"
        label="Folder Name"
        placeholder="Enter folder name"
        confirmText="Create"
        validate={(value) => {
          if (!value.trim()) return 'Folder name cannot be empty';
          return null;
        }}
      />
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}

function SidebarItem({ icon, label, count, active, onClick, color }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? 'bg-[rgba(124,58,237,0.2)] text-[var(--color-white-primary)] border-l-2 border-[var(--color-violet-primary)]'
          : 'text-[var(--color-white-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-white-primary)]'
      }`}
    >
      <span className={color ? `text-[${color}]` : 'text-current'}>{icon}</span>
      <span className="flex-1 text-left truncate">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-[var(--color-white-muted)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
