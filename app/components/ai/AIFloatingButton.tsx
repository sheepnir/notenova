'use client';

import { Editor } from '@tiptap/react';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAIStore } from '@/app/store/useAIStore';

interface AIFloatingButtonProps {
  editor: Editor;
}

export default function AIFloatingButton({ editor }: AIFloatingButtonProps) {
  const [showButton, setShowButton] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { improveText, openModal } = useAIStore();

  useEffect(() => {
    const updateButtonPosition = () => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;

      if (hasSelection) {
        // Get selection coordinates
        const start = editor.view.coordsAtPos(from);
        const end = editor.view.coordsAtPos(to);

        // Position button above selection
        const top = start.top - 50; // 50px above selection
        const left = (start.left + end.left) / 2 - 25; // Center horizontally (button is ~50px wide)

        setPosition({ top, left });
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Update position on selection change
    editor.on('selectionUpdate', updateButtonPosition);
    editor.on('update', updateButtonPosition);

    return () => {
      editor.off('selectionUpdate', updateButtonPosition);
      editor.off('update', updateButtonPosition);
    };
  }, [editor]);

  const handleClick = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (selectedText) {
      const result = await improveText(selectedText);
      if (result) {
        openModal('Improved Text', result, 'replace');
      }
    }
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 40,
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-violet-primary)] text-white rounded-lg shadow-[var(--shadow-md)] hover:bg-[var(--color-violet-hover)] hover:shadow-[var(--glow-violet)] transition-all animate-fadeIn text-sm font-medium"
    >
      <Sparkles size={14} />
      <span>AI</span>
    </button>
  );
}
