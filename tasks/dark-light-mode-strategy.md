# Dark & Light Mode Implementation Strategy

## Overview
Add theme switching capability to NoteNova with two modes:
- **Dark Mode** (default): Current "Cosmic Night" theme
- **Light Mode**: New complementary "Cosmic Day" theme

## Core Principle
**Simplicity First** - Minimal code changes, maximum compatibility. Use existing CSS variable architecture.

---

## Strategy Approach

### 1. **State Management**
- Add `theme: 'dark' | 'light'` to Zustand store (`useStore.ts`)
- Add `setTheme(theme)` action
- Persist theme preference in LocalStorage (`notenova_theme`)
- Initialize from LocalStorage on app load

### 2. **CSS Architecture**
- Use `data-theme` attribute on `<html>` element
  - `data-theme="dark"` → Cosmic Night (current theme)
  - `data-theme="light"` → Cosmic Day (new light theme)
- Define two color palettes in `globals.css`:
  - `:root` - Default dark mode colors (keep current)
  - `[data-theme="light"]` - Light mode color overrides
- **Key Benefit**: Zero component changes needed (already using CSS variables)

### 3. **Light Mode Color Palette** (Cosmic Day)

Create an inverted, accessible color scheme that maintains the "cosmic" brand:

```css
[data-theme="light"] {
  /* Backgrounds - Light purples/lavenders */
  --color-space-darkest: #faf9fc;        /* Lightest background */
  --color-space-dark: #f5f3ff;           /* Main background */
  --color-space-elevated: #ffffff;       /* Elevated surfaces (cards) */

  /* Primary - Keep violet brand color */
  --color-violet-primary: #7c3aed;       /* Same as dark mode */
  --color-violet-hover: #6d28d9;         /* Slightly darker on hover */
  --color-violet-active: #5b21b6;        /* Darker active state */

  /* Borders & Accents - Subtle purples */
  --color-lavender-border: #e9d5ff;      /* Soft border */
  --color-lavender-subtle: #f3e8ff;      /* Subtle backgrounds */
  --color-lavender-light: #faf5ff;       /* Very light accents */

  /* Secondary */
  --color-blue-dark: #818cf8;
  --color-blue-deep: #6366f1;
  --color-blue-bright: #4f46e5;

  /* Text - Dark grays/purples */
  --color-white-primary: #1e1b4b;        /* Primary text (dark) */
  --color-white-off: #2d1b4e;            /* Off-primary text */
  --color-white-secondary: #4c1d95;      /* Secondary text */
  --color-white-muted: #6b7280;          /* Muted text */

  /* Accents - Softer versions */
  --color-pink-accent: #ec4899;          /* Keep vibrant */
  --color-pink-light: #f472b6;
  --color-teal: #06b6d4;

  /* Functional - Ensure visibility */
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;

  /* Semantic mappings */
  --background: var(--color-space-dark);
  --foreground: var(--color-white-primary);
}
```

### 4. **UI Components**

**Theme Toggle Button** - Add to TopBar component:
- **Icon**: Sun (☀️) for light mode, Moon (🌙) for dark mode
- **Location**: Right side of TopBar, before "New Note" button
- **Interaction**: Single click to toggle
- **Animation**: Smooth icon transition

### 5. **Technical Implementation Plan**

#### Files to Modify (6 files total):

1. **`app/types/index.ts`** - Add type definitions
   ```typescript
   export type Theme = 'dark' | 'light';
   ```

2. **`app/lib/storage.ts`** - Add theme storage helpers
   ```typescript
   const STORAGE_KEYS = {
     // ... existing keys
     THEME: 'notenova_theme',
   };

   getTheme: (): Theme => { /* ... */ }
   saveTheme: (theme: Theme): void => { /* ... */ }
   ```

3. **`app/store/useStore.ts`** - Add theme state
   ```typescript
   interface StoreState {
     // ... existing fields
     theme: Theme;
     setTheme: (theme: Theme) => void;
   }
   ```

4. **`app/globals.css`** - Add light mode CSS
   - Keep existing `:root` styles as-is
   - Add `[data-theme="light"]` selector with light palette
   - Add transition for smooth theme switching:
     ```css
     * {
       transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
     }
     ```

5. **`app/layout.tsx`** - Apply theme to HTML
   - Create client component wrapper or use effect
   - Read theme from store
   - Apply `data-theme` attribute to `<html>` element
   - Prevent FOUC (flash of unstyled content)

6. **`app/components/layout/TopBar.tsx`** - Add toggle button
   - Import Sun/Moon icons from Lucide React
   - Add button before "New Note"
   - Connect to `setTheme` action

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add `Theme` type to `app/types/index.ts`
- [ ] Add theme storage helpers to `app/lib/storage.ts` (`getTheme()`, `saveTheme()`)
- [ ] Add theme state to Zustand store (`theme`, `setTheme`)
- [ ] Wire up LocalStorage persistence for theme

### Phase 2: Styling
- [ ] Create light mode color palette in `globals.css`
- [ ] Add smooth transition styles
- [ ] Test color contrast for WCAG AA compliance
- [ ] Verify all components render correctly in light mode

### Phase 3: UI Integration
- [ ] Create theme provider logic in `app/layout.tsx`
- [ ] Apply `data-theme` attribute based on store state
- [ ] Prevent flash of unstyled content (FOUC)
- [ ] Add theme toggle button to TopBar
- [ ] Add Sun/Moon icon with smooth transition

### Phase 4: Testing
- [ ] Test theme toggle functionality
- [ ] Verify theme persistence across page reloads
- [ ] Test all major components in both themes
- [ ] Check accessibility (contrast ratios, focus states)
- [ ] Test on mobile/responsive layouts
- [ ] Verify no console errors or warnings

### Phase 5: Final Polish
- [ ] Review all colors for consistency
- [ ] Ensure smooth transitions everywhere
- [ ] Test with empty state (no notes)
- [ ] Test with many notes
- [ ] Commit changes with clear message
- [ ] Push to branch

---

## Design Decisions & Rationale

### ✅ Why Data Attributes over Class Names?
- More semantic: `data-theme="light"` clearly indicates purpose
- Cleaner CSS selectors: `[data-theme="light"]` vs `.light-mode`
- Better SSR/hydration compatibility with Next.js
- Industry standard pattern (used by shadcn/ui, Tailwind, etc.)

### ✅ Why Keep Dark Mode as Default?
- Maintains current user experience (no breaking changes)
- Dark mode increasingly popular as default
- Cosmic Night is the app's signature aesthetic
- New users see the intended design first

### ✅ Why Simple Toggle vs Dropdown/System Preference?
- **Phase 1**: Only two themes → simple toggle is fastest UX
- **Future**: Can add system preference detection later
- Keeps implementation simple and focused
- One-click access vs multi-step menu

### ✅ Why CSS Variables over Tailwind Classes?
- Already using CSS variables extensively
- Single source of truth for colors
- No component changes needed
- Easier to maintain and extend

### ✅ Why Store Theme in Zustand?
- Consistent with app's state management pattern
- Easy to access from any component
- Built-in persistence with LocalStorage
- Reactive updates across entire app

---

## Accessibility Requirements (WCAG AA)

Must meet these contrast ratios:
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum (18pt+ or 14pt+ bold)
- **UI components**: 3:1 minimum

Light mode colors chosen to ensure:
- Dark text (#1e1b4b) on light backgrounds (#f5f3ff) = ~12:1 ✅
- Violet buttons (#7c3aed) with white text = ~4.8:1 ✅
- Muted text (#6b7280) on light background = ~5.2:1 ✅

---

## Future Enhancements (Not in Scope)

These can be added later if desired:
- System preference detection (`prefers-color-scheme`)
- Auto-switch based on time of day
- Per-note theme overrides
- Additional theme variants (high contrast, sepia, etc.)
- Custom theme builder
- Smooth animations for theme transitions (beyond basic fade)

---

## Code Impact Analysis

**Files Created**: 0 (all modifications to existing files)

**Files Modified**: 6
1. `app/types/index.ts` - Add 1 type
2. `app/lib/storage.ts` - Add 2 functions (~15 lines)
3. `app/store/useStore.ts` - Add state field + action (~20 lines)
4. `app/globals.css` - Add light mode palette (~60 lines)
5. `app/layout.tsx` - Add theme provider logic (~25 lines)
6. `app/components/layout/TopBar.tsx` - Add toggle button (~15 lines)

**Total Lines Added**: ~135 lines
**Components Changed**: 0 (CSS variables handle everything)

**Risk Assessment**: ⭐ Low Risk
- Non-breaking changes
- Isolated to theme system
- Easy to rollback if needed
- No data migration required

---

## Review Section
*(To be filled after implementation)*

### Summary of Changes

### Testing Results

### Known Issues

### Screenshots
- [ ] Dark mode (before)
- [ ] Light mode (after)
- [ ] Theme toggle interaction

---

**Status**: ✅ Strategy Complete - Ready for Implementation

**Next Step**: Review this strategy with user, then proceed with Phase 1 implementation.
