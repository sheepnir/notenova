import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, extractTextFromResponse, getUsageStats } from '@/app/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { content, existingTags = [] } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build prompt with existing tags context
    let userPrompt = `Content to tag:\n\n${content}`;
    if (existingTags.length > 0) {
      userPrompt += `\n\nExisting tags in this note collection: ${existingTags.join(', ')}`;
      userPrompt += '\nPrefer using existing tags when appropriate.';
    }

    const response = await callOpenAI({
      operation: 'suggest-tags',
      userPrompt,
      stream: false,
    });

    if ('choices' in response) {
      const result = extractTextFromResponse(response);
      const usage = getUsageStats(response);

      // Parse JSON array from response
      try {
        const tags = JSON.parse(result);
        if (Array.isArray(tags)) {
          return NextResponse.json({
            tags,
            usage,
          });
        }
      } catch (parseError) {
        console.error('Failed to parse tag suggestions:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse tag suggestions' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Unexpected response format' },
      { status: 500 }
    );
  } catch (error) {
    console.error('AI suggest tags error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to suggest tags' },
      { status: 500 }
    );
  }
}
