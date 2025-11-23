import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, extractTextFromResponse, getUsageStats, SummarizeFormat } from '@/app/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { text, format = 'paragraph' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await callOpenAI({
      operation: 'summarize',
      userPrompt: text,
      format: format as SummarizeFormat,
      stream: false,
    });

    if ('choices' in response) {
      const result = extractTextFromResponse(response);
      const usage = getUsageStats(response);

      return NextResponse.json({
        result,
        usage,
      });
    }

    return NextResponse.json(
      { error: 'Unexpected response format' },
      { status: 500 }
    );
  } catch (error) {
    console.error('AI summarize error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to summarize text' },
      { status: 500 }
    );
  }
}
