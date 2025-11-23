'use client';

import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { initializeSampleData } from './lib/storage';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import NoteList from './components/layout/NoteList';
import Editor from './components/editor/Editor';

export default function Home() {
  const { initialize } = useStore();

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
        <TopBar />

        {/* Content: Note List + Editor */}
        <div className="flex-1 flex overflow-hidden">
          <NoteList />
          <Editor />
        </div>
      </div>
    </div>
  );
}
