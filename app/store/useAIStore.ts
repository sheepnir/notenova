import { create } from 'zustand';
import { SummarizeFormat } from '../lib/ai/types';

interface AIState {
  // UI State
  isProcessing: boolean;
  currentOperation: string | null;
  error: string | null;
  result: string | null;
  showModal: boolean;

  // Modal state
  modalTitle: string;
  modalAction: 'replace' | 'insert' | null;

  // Actions
  setProcessing: (processing: boolean, operation?: string) => void;
  setError: (error: string | null) => void;
  setResult: (result: string | null) => void;
  openModal: (title: string, result: string, action: 'replace' | 'insert') => void;
  closeModal: () => void;
  reset: () => void;

  // AI Operations
  improveText: (text: string) => Promise<string | null>;
  summarizeText: (text: string, format?: SummarizeFormat) => Promise<string | null>;
  generateContent: (prompt: string) => Promise<string | null>;
  continueWriting: (text: string) => Promise<string | null>;
  suggestTags: (content: string, existingTags?: string[]) => Promise<string[] | null>;
}

export const useAIStore = create<AIState>((set, get) => ({
  // Initial State
  isProcessing: false,
  currentOperation: null,
  error: null,
  result: null,
  showModal: false,
  modalTitle: '',
  modalAction: null,

  // UI Actions
  setProcessing: (processing, operation = null) =>
    set({ isProcessing: processing, currentOperation: operation }),

  setError: (error) => set({ error, isProcessing: false }),

  setResult: (result) => set({ result }),

  openModal: (title, result, action) =>
    set({ showModal: true, modalTitle: title, result, modalAction: action }),

  closeModal: () =>
    set({ showModal: false, modalTitle: '', result: null, modalAction: null }),

  reset: () =>
    set({
      isProcessing: false,
      currentOperation: null,
      error: null,
      result: null,
      showModal: false,
      modalTitle: '',
      modalAction: null,
    }),

  // AI Operations
  improveText: async (text: string) => {
    set({ isProcessing: true, currentOperation: 'improve', error: null });

    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to improve text');
      }

      const data = await response.json();
      set({ isProcessing: false, result: data.result });
      return data.result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to improve text';
      set({ error: errorMessage, isProcessing: false });
      return null;
    }
  },

  summarizeText: async (text: string, format: SummarizeFormat = 'paragraph') => {
    set({ isProcessing: true, currentOperation: 'summarize', error: null });

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, format }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to summarize text');
      }

      const data = await response.json();
      set({ isProcessing: false, result: data.result });
      return data.result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to summarize text';
      set({ error: errorMessage, isProcessing: false });
      return null;
    }
  },

  generateContent: async (prompt: string) => {
    set({ isProcessing: true, currentOperation: 'generate', error: null });

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const data = await response.json();
      set({ isProcessing: false, result: data.result });
      return data.result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      set({ error: errorMessage, isProcessing: false });
      return null;
    }
  },

  continueWriting: async (text: string) => {
    set({ isProcessing: true, currentOperation: 'continue', error: null });

    try {
      const response = await fetch('/api/ai/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to continue text');
      }

      const data = await response.json();
      set({ isProcessing: false, result: data.result });
      return data.result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to continue text';
      set({ error: errorMessage, isProcessing: false });
      return null;
    }
  },

  suggestTags: async (content: string, existingTags: string[] = []) => {
    set({ isProcessing: true, currentOperation: 'suggest-tags', error: null });

    try {
      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, existingTags }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to suggest tags');
      }

      const data = await response.json();
      set({ isProcessing: false });
      return data.tags;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to suggest tags';
      set({ error: errorMessage, isProcessing: false });
      return null;
    }
  },
}));
