'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Undo,
  Redo,
  Link,
  Image as ImageIcon,
} from 'lucide-react';
import AIToolbar from '../ai/AIToolbar';

interface EditorToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="sticky top-0 z-10 border-b border-[rgba(196,181,253,0.1)] bg-[var(--color-space-dark)] px-16 py-3">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold size={18} />}
          tooltip="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic size={18} />}
          tooltip="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<Strikethrough size={18} />}
          tooltip="Strikethrough"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<Code size={18} />}
          tooltip="Code"
        />

        <div className="w-px h-6 bg-[rgba(196,181,253,0.2)] mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={<Heading1 size={18} />}
          tooltip="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<Heading2 size={18} />}
          tooltip="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={<Heading3 size={18} />}
          tooltip="Heading 3"
        />

        <div className="w-px h-6 bg-[rgba(196,181,253,0.2)] mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<List size={18} />}
          tooltip="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered size={18} />}
          tooltip="Numbered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={<CheckSquare size={18} />}
          tooltip="Task List"
        />

        <div className="w-px h-6 bg-[rgba(196,181,253,0.2)] mx-1" />

        {/* Block Quote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<Quote size={18} />}
          tooltip="Block Quote"
        />

        <div className="w-px h-6 bg-[rgba(196,181,253,0.2)] mx-1" />

        {/* Media */}
        <ToolbarButton onClick={addLink} icon={<Link size={18} />} tooltip="Add Link" />
        <ToolbarButton onClick={addImage} icon={<ImageIcon size={18} />} tooltip="Add Image" />

        <div className="w-px h-6 bg-[rgba(196,181,253,0.2)] mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={<Undo size={18} />}
          tooltip="Undo"
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={<Redo size={18} />}
          tooltip="Redo"
          disabled={!editor.can().redo()}
        />

        <div className="w-px h-6 bg-[rgba(196,181,253,0.2)] mx-1" />

        {/* AI */}
        <AIToolbar editor={editor} />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
}

function ToolbarButton({ onClick, isActive, icon, tooltip, disabled }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-2 rounded transition-all ${
        isActive
          ? 'bg-[var(--color-violet-primary)] text-white'
          : 'text-[var(--color-white-muted)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-white-primary)]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
}
