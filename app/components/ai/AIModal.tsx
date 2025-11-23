'use client';

import { useAIStore } from '@/app/store/useAIStore';
import { X, Check, Copy, RotateCw } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

interface AIModalProps {
  onAccept: (result: string, action: 'replace' | 'insert') => void;
  onRegenerate?: () => void;
}

export default function AIModal({ onAccept, onRegenerate }: AIModalProps) {
  const { showModal, modalTitle, result, modalAction, closeModal } = useAIStore();
  const [copied, setCopied] = useState(false);

  if (!showModal || !result) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    if (modalAction) {
      onAccept(result, modalAction);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(10,1,24,0.8)] backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative glass max-w-2xl w-full max-h-[80vh] flex flex-col rounded-xl shadow-[var(--shadow-lg)] glow-violet">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(196,181,253,0.2)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-semibold text-[var(--color-white-primary)]">
              {modalTitle}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--color-white-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-[var(--color-space-elevated)] rounded-lg p-4 border border-[rgba(196,181,253,0.1)]">
            <pre className="whitespace-pre-wrap text-[var(--color-white-primary)] font-sans text-base leading-relaxed">
              {result}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[rgba(196,181,253,0.2)] gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            {onRegenerate && (
              <Button variant="ghost" size="sm" onClick={onRegenerate}>
                <RotateCw size={16} />
                Regenerate
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAccept}>
              <Check size={16} />
              {modalAction === 'replace' ? 'Replace' : 'Insert'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
