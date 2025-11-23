import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, extractTextFromResponse, getUsageStats } from '@/app/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
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
      operation: 'generate',
      userPrompt: prompt,
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
    console.error('AI generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
}
