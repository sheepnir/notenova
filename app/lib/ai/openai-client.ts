import OpenAI from 'openai';
import { getSystemPrompt } from './prompts';
import { AIOperation, SummarizeFormat } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const MODEL = process.env.AI_MODEL || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || '1000');
const TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.7');

export interface CallAIOptions {
  operation: AIOperation;
  userPrompt: string;
  format?: SummarizeFormat;
  stream?: boolean;
}

/**
 * Call OpenAI API with the specified operation
 */
export async function callOpenAI(options: CallAIOptions) {
  const { operation, userPrompt, format, stream = false } = options;

  const systemPrompt = getSystemPrompt(
    operation as 'improve' | 'summarize' | 'generate' | 'continue' | 'suggest-tags',
    format
  );

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  if (stream) {
    // Return streaming response
    return openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      stream: true,
    });
  }

  // Return complete response
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  });

  return response;
}

/**
 * Extract text from OpenAI response
 */
export function extractTextFromResponse(response: OpenAI.Chat.ChatCompletion): string {
  return response.choices[0]?.message?.content || '';
}

/**
 * Get usage statistics from response
 */
export function getUsageStats(response: OpenAI.Chat.ChatCompletion) {
  return {
    promptTokens: response.usage?.prompt_tokens || 0,
    completionTokens: response.usage?.completion_tokens || 0,
    totalTokens: response.usage?.total_tokens || 0,
  };
}
