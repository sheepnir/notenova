'use client';

import { useState } from 'react';
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
import InputDialog from '../ui/InputDialog';

interface EditorToolbarProps {
  editor: Editor;
}

type DialogType = 'link' | 'image' | null;

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [dialogType, setDialogType] = useState<DialogType>(null);

  const addImage = () => {
    setDialogType('image');
  };

  const addLink = () => {
    setDialogType('link');
  };

  const handleDialogConfirm = (value: string) => {
    if (dialogType === 'image') {
      editor.chain().focus().setImage({ src: value }).run();
    } else if (dialogType === 'link') {
      editor.chain().focus().setLink({ href: value }).run();
    }
    setDialogType(null);
  };

  const validateURL = (value: string) => {
    if (!value.trim()) return 'URL cannot be empty';
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  };

  return (
    <>
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

      {/* Link/Image Input Dialog */}
      <InputDialog
        isOpen={dialogType !== null}
        onClose={() => setDialogType(null)}
        onConfirm={handleDialogConfirm}
        title={dialogType === 'link' ? 'Add Link' : 'Add Image'}
        label={dialogType === 'link' ? 'Link URL' : 'Image URL'}
        placeholder={dialogType === 'link' ? 'https://example.com' : 'https://example.com/image.jpg'}
        confirmText="Add"
        validate={validateURL}
      />
    </>
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
