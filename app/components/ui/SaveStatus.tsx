'use client';

import { useStore } from '@/app/store/useStore';
import { Check, Loader2 } from 'lucide-react';

export default function SaveStatus() {
  const { isSaving } = useStore();

  return (
    <div className="flex items-center gap-2 text-sm animate-fadeIn">
      {isSaving ? (
        <>
          <Loader2 size={14} className="text-[var(--color-white-muted)] animate-spin" />
          <span className="text-[var(--color-white-muted)]">Saving...</span>
        </>
      ) : (
        <>
          <Check size={14} className="text-[var(--color-violet-primary)]" />
          <span className="text-[var(--color-violet-primary)]">Saved</span>
        </>
      )}
    </div>
  );
}
