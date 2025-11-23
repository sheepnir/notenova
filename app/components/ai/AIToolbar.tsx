'use client';

import { Editor } from '@tiptap/react';
import { Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAIStore } from '@/app/store/useAIStore';

interface AIToolbarProps {
  editor: Editor;
}

export default function AIToolbar({ editor }: AIToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showGeneratePrompt, setShowGeneratePrompt] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    isProcessing,
    improveText,
    summarizeText,
    generateContent,
    continueWriting,
    openModal,
  } = useAIStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
  };

  const getAllText = () => {
    return editor.getText();
  };

  const replaceSelection = (text: string) => {
    editor.chain().focus().deleteSelection().insertContent(text).run();
  };

  const insertAtCursor = (text: string) => {
    editor.chain().focus().insertContent(text).run();
  };

  const handleImprove = async () => {
    const selectedText = getSelectedText();
    if (!selectedText) {
      alert('Please select some text to improve');
      return;
    }

    setShowMenu(false);
    const result = await improveText(selectedText);
    if (result) {
      openModal('Improved Text', result, 'replace');
    }
  };

  const handleSummarize = async (format: 'paragraph' | 'bullets' | 'key-points') => {
    const selectedText = getSelectedText() || getAllText();
    if (!selectedText) {
      alert('No text to summarize');
      return;
    }

    setShowMenu(false);
    const result = await summarizeText(selectedText, format);
    if (result) {
      openModal(`Summary (${format})`, result, 'insert');
    }
  };

  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;

    setShowMenu(false);
    setShowGeneratePrompt(false);
    const result = await generateContent(generatePrompt);
    if (result) {
      openModal('Generated Content', result, 'insert');
      setGeneratePrompt('');
    }
  };

  const handleContinue = async () => {
    const allText = getAllText();
    if (!allText) {
      alert('Write something first, and AI will continue from there');
      return;
    }

    setShowMenu(false);
    const result = await continueWriting(allText);
    if (result) {
      insertAtCursor('\n' + result);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* AI Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isProcessing}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isProcessing
            ? 'bg-[var(--color-violet-primary)] text-white opacity-50 cursor-wait'
            : 'bg-[var(--color-violet-primary)] text-white hover:bg-[var(--color-violet-hover)] hover:shadow-[var(--glow-violet)]'
        }`}
      >
        {isProcessing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        <span>AI</span>
        <ChevronDown size={14} className={showMenu ? 'rotate-180 transition-transform' : ''} />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full left-0 mt-2 w-64 glass rounded-lg shadow-[var(--shadow-lg)] overflow-hidden z-10 animate-slideIn">
          <div className="p-2">
            <button
              onClick={handleImprove}
              className="w-full text-left px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-white-primary)] text-sm transition-colors"
            >
              ✨ Improve Writing
            </button>
            <button
              onClick={() => handleSummarize('paragraph')}
              className="w-full text-left px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-white-primary)] text-sm transition-colors"
            >
              📝 Summarize (Paragraph)
            </button>
            <button
              onClick={() => handleSummarize('bullets')}
              className="w-full text-left px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-white-primary)] text-sm transition-colors"
            >
              • Summarize (Bullets)
            </button>
            <button
              onClick={() => handleSummarize('key-points')}
              className="w-full text-left px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-white-primary)] text-sm transition-colors"
            >
              🔑 Summarize (Key Points)
            </button>
            <button
              onClick={handleContinue}
              className="w-full text-left px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-white-primary)] text-sm transition-colors"
            >
              ➡️ Continue Writing
            </button>
            <div className="border-t border-[rgba(196,181,253,0.2)] my-2" />
            <button
              onClick={() => {
                setShowGeneratePrompt(true);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-white-primary)] text-sm transition-colors"
            >
              🎯 Generate from Prompt
            </button>
          </div>
        </div>
      )}

      {/* Generate Prompt Dialog */}
      {showGeneratePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="absolute inset-0 bg-[rgba(10,1,24,0.8)]"
            onClick={() => setShowGeneratePrompt(false)}
          />
          <div className="relative glass max-w-md w-full rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--color-white-primary)] mb-4">
              Generate Content
            </h3>
            <textarea
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
              placeholder="Describe what you want to write about..."
              className="w-full h-32 px-4 py-3 bg-[var(--color-space-elevated)] border border-[rgba(196,181,253,0.1)] rounded-lg text-[var(--color-white-primary)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-primary)] resize-none"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowGeneratePrompt(false)}
                className="flex-1 px-4 py-2 border border-[var(--color-lavender-border)] text-[var(--color-lavender-border)] rounded-lg hover:bg-[rgba(124,58,237,0.1)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!generatePrompt.trim()}
                className="flex-1 px-4 py-2 bg-[var(--color-violet-primary)] text-white rounded-lg hover:bg-[var(--color-violet-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
