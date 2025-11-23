'use client';

import { useEffect, useRef } from 'react';
import { useStore } from './store/useStore';
import { initializeSampleData } from './lib/storage';
import Sidebar from './components/layout/Sidebar';
import TopBar, { TopBarRef } from './components/layout/TopBar';
import NoteList from './components/layout/NoteList';
import Editor from './components/editor/Editor';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function Home() {
  const { initialize } = useStore();
  const topBarRef = useRef<TopBarRef>(null);

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => topBarRef.current?.focusSearch(),
  });

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
    </div>
  );
}
