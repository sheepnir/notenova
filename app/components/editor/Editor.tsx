'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect } from 'react';
import { useStore } from '@/app/store/useStore';
import EditorToolbar from './EditorToolbar';
import AIModal from '../ai/AIModal';
import AIFloatingButton from '../ai/AIFloatingButton';
import './editor.css';

export default function Editor() {
  const { notes, activeNoteId, updateNote } = useStore();
  const activeNote = notes.find((n) => n.id === activeNoteId);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--color-violet-primary)] underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'task-item',
        },
        nested: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none px-16 py-8 min-h-screen',
      },
    },
    onUpdate: ({ editor }) => {
      if (activeNote) {
        const content = JSON.stringify(editor.getJSON());
        // Debounced auto-save
        setTimeout(() => {
          updateNote(activeNote.id, { content });
        }, 500);
      }
    },
  });

  // Update editor content when active note changes
  useEffect(() => {
    if (editor && activeNote) {
      try {
        const content = JSON.parse(activeNote.content);
        editor.commands.setContent(content);
      } catch (error) {
        console.error('Error parsing note content:', error);
        editor.commands.setContent('');
      }
    } else if (editor) {
      editor.commands.setContent('');
    }
  }, [activeNoteId, editor]);

  // Handle AI result acceptance
  const handleAcceptAIResult = (result: string, action: 'replace' | 'insert') => {
    if (!editor) return;

    if (action === 'replace') {
      editor.chain().focus().deleteSelection().insertContent(result).run();
    } else {
      editor.chain().focus().insertContent(result).run();
    }
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--color-white-muted)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-[var(--color-white-primary)]">No note selected</h2>
          <p>Select a note from the list or create a new one to start writing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-space-dark)] overflow-hidden">
      {/* Note Title */}
      <div className="px-16 pt-8 pb-4 border-b border-[rgba(196,181,253,0.1)]">
        <input
          type="text"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-[var(--color-white-primary)] placeholder:text-[var(--color-white-muted)]"
          placeholder="Untitled"
        />
        <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-white-muted)]">
          <span>Last edited {new Date(activeNote.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* AI Components */}
      {editor && (
        <>
          <AIFloatingButton editor={editor} />
          <AIModal onAccept={handleAcceptAIResult} />
        </>
      )}
    </div>
  );
}
