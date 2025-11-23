export type AIOperation =
  | 'improve'
  | 'summarize'
  | 'generate'
  | 'continue'
  | 'suggest-tags';

export type SummarizeFormat = 'paragraph' | 'bullets' | 'key-points';

export interface AIRequest {
  text: string;
  operation: AIOperation;
  format?: SummarizeFormat;
  prompt?: string;
  existingTags?: string[];
}

export interface AIResponse {
  result: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
}

export interface TagSuggestion {
  name: string;
  confidence: number;
}
