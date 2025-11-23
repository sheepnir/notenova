'use client';

import { Search, Plus, Menu, Sun, Moon } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import { useRef, useImperativeHandle, forwardRef } from 'react';
import Button from '../ui/Button';

export interface TopBarRef {
  focusSearch: () => void;
}

const TopBar = forwardRef<TopBarRef>((props, ref) => {
  const { searchQuery, setSearchQuery, addNote, toggleSidebar, sidebarCollapsed, theme, setTheme } = useStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      searchInputRef.current?.focus();
    },
  }));

  const handleNewNote = () => {
    const newNote = addNote({
      title: 'Untitled Note',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      }),
      folderId: null,
      tags: [],
      isFavorited: false,
    });
  };

  return (
    <div className="h-16 bg-[var(--color-space-darkest)] border-b border-[rgba(196,181,253,0.1)] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <Menu size={20} className="text-[var(--color-white-primary)]" />
          </button>
        )}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-space-elevated)] border border-[rgba(196,181,253,0.1)] rounded-lg text-[var(--color-white-primary)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-primary)] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-[var(--color-white-primary)]" />
          ) : (
            <Moon size={20} className="text-[var(--color-white-primary)]" />
          )}
        </button>
        <Button size="sm" onClick={handleNewNote}>
          <Plus size={18} />
          New Note
        </Button>
      </div>
    </div>
  );
});

TopBar.displayName = 'TopBar';

export default TopBar;
