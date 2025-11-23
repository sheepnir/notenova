# AI Feature Integration - Task List

## Project: Add AI functionality to NoteNova
**AI Provider:** OpenAI GPT-4o mini
**UI Approach:** All access points (toolbar, slash commands, context menu, floating button)
**Date Started:** November 22, 2025

---

## Phase 1: Foundation & Setup

### 1. Environment & Dependencies
- [ ] Install OpenAI SDK (`npm install openai`)
- [ ] Install Vercel AI SDK (`npm install ai`)
- [ ] Create `.env.local` file with OPENAI_API_KEY
- [ ] Add TypeScript types for environment variables

### 2. AI Service Layer (New Files)
- [ ] Create `app/lib/ai/types.ts` - TypeScript interfaces
- [ ] Create `app/lib/ai/prompts.ts` - System prompts for each operation
- [ ] Create `app/lib/ai/openai-client.ts` - OpenAI SDK wrapper
- [ ] Create `app/lib/ai/index.ts` - Main service export

### 3. API Routes (New Files)
- [ ] Create `app/api/ai/improve/route.ts` - Improve writing
- [ ] Create `app/api/ai/summarize/route.ts` - Summarize text
- [ ] Create `app/api/ai/generate/route.ts` - Generate from prompt
- [ ] Create `app/api/ai/continue/route.ts` - Continue writing
- [ ] Create `app/api/ai/suggest-tags/route.ts` - Auto-tag suggestions

### 4. State Management (New File)
- [ ] Create `app/store/useAIStore.ts` - AI-specific Zustand store

### 5. UI Components (New Files)
- [ ] Create `app/components/ai/AIModal.tsx` - Modal for AI results
- [ ] Create `app/components/ai/AIToolbar.tsx` - Toolbar AI section
- [ ] Create `app/components/ai/AIFloatingButton.tsx` - Selection button
- [ ] Create `app/components/ai/AIStreamDisplay.tsx` - Streaming text UI

### 6. Editor Integration (Minimal Modifications)
- [ ] Update `app/components/editor/EditorToolbar.tsx` - Add AI toolbar
- [ ] Update `app/components/editor/Editor.tsx` - Add AI floating button
- [ ] Add Tiptap slash command extension (if simple, else defer)

### 7. Testing & Polish
- [ ] Test all AI operations in browser
- [ ] Verify error handling
- [ ] Test with long text inputs
- [ ] Verify streaming responses work
- [ ] Test auto-tag suggestions
- [ ] Check mobile responsiveness of AI UI

### 8. Documentation
- [ ] Update README.md with AI features
- [ ] Add .env.example with required variables
- [ ] Update CLAUDE.md with AI architecture notes

---

## Implementation Notes

### Completed Tasks
*(Will be updated as tasks are completed)*

### Blockers / Issues
*(Will be noted if any arise)*

### Decisions Made
- Using OpenAI GPT-4o mini for cost-effectiveness
- Separate AI store (useAIStore) for modularity
- All new files, minimal modifications to existing code
- API routes for server-side AI calls (protect API keys)

---

## Review Section
*(To be completed after implementation)*

### Changes Summary


### Files Created


### Files Modified


### Testing Results


### Known Issues / Future Improvements


### Compliance with CLAUDE.md Rules
- [ ] All changes kept as simple as possible
- [ ] Minimal impact on existing code
- [ ] No lazy fixes or shortcuts
- [ ] Proper error handling implemented
- [ ] Code follows existing patterns
