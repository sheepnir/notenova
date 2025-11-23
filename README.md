# NoteNova ✨

**Your thoughts, beautifully organized**

NoteNova is a beautiful, powerful note-taking application featuring the stunning **Cosmic Night** theme. Built with Next.js, TypeScript, and Tiptap, it offers a delightful writing experience with AI-powered features (UI ready, backend integration pending).

![Cosmic Night Theme](https://img.shields.io/badge/Theme-Cosmic%20Night-7c3aed?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 Beautiful Cosmic Night Design
- Stunning purple and violet color palette inspired by the cosmos
- Glassmorphism effects and smooth animations
- Custom scrollbars and selection styles
- Carefully crafted typography

### 📝 Powerful Rich Text Editor
- **Formatting**: Bold, italic, strikethrough, inline code
- **Headings**: H1, H2, H3 support
- **Lists**: Bullet lists, numbered lists, and task lists with checkboxes
- **Media**: Image embedding and links
- **Block quotes**: Beautiful styled quotes
- **Undo/Redo**: Full history support
- **Auto-save**: Your work is saved automatically

### 📁 Organization
- **Folders**: Create nested folders with custom icons and colors
- **Tags**: Flexible tagging system with color coding
- **Favorites**: Star important notes for quick access
- **Recent Notes**: Quick access to recently edited notes
- **Search**: Full-text search across all notes

### 🎯 Smart Features
- **Local Storage**: All data stored in browser (no backend required for demo)
- **Real-time Updates**: Instant UI updates with Zustand state management
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Efficient workflow for power users

### 🚀 Coming Soon (UI Ready)
- AI writing assistance
- AI auto-tagging
- AI summarization
- Voice transcription
- Cloud sync
- Collaboration features

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd notenova
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! NoteNova will load with sample notes to get you started.

## 📖 Usage Guide

### Creating Notes
- Click the **"+ New Note"** button in the top bar
- Start typing in the editor
- Your note auto-saves every 2 seconds

### Organizing Notes
- **Create Folders**: Click the + icon next to "Folders" in the sidebar
- **Tag Notes**: Add tags to categorize notes across folders
- **Favorite Notes**: Click the star icon on any note card
- **Search**: Use the search bar in the top navigation

### Formatting Text
Use the toolbar buttons or keyboard shortcuts:
- **Bold**: `Cmd/Ctrl + B`
- **Italic**: `Cmd/Ctrl + I`
- **Strikethrough**: `Cmd/Ctrl + Shift + X`
- **Headings**: Click H1, H2, or H3 in toolbar
- **Lists**: Click list buttons or type `-` for bullets, `1.` for numbers
- **Tasks**: Click checkbox button or type `[ ]`
- **Links**: Click link button and enter URL
- **Images**: Click image button and enter image URL

### Managing the Sidebar
- Click the X icon to collapse the sidebar
- Click the menu icon to expand it again

## 🏗️ Project Structure

```
notenova/
├── app/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── Editor.tsx          # Main Tiptap editor
│   │   │   ├── EditorToolbar.tsx   # Formatting toolbar
│   │   │   └── editor.css          # Editor styles
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── TopBar.tsx          # Search and actions
│   │   │   └── NoteList.tsx        # Note list view
│   │   └── ui/
│   │       └── Button.tsx          # Reusable button component
│   ├── lib/
│   │   └── storage.ts              # LocalStorage utilities
│   ├── store/
│   │   └── useStore.ts             # Zustand state management
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── globals.css                 # Cosmic Night theme
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── public/                         # Static assets
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🎨 Cosmic Night Color Palette

```css
/* Deep Space Purple (Backgrounds) */
--color-space-darkest: #0A0118
--color-space-dark: #1a0033
--color-space-elevated: #2d1b4e

/* Vibrant Violet (Primary) */
--color-violet-primary: #7c3aed
--color-violet-hover: #8b5cf6
--color-violet-active: #a78bfa

/* Accent Colors */
--color-pink-accent: #ec4899
--color-teal: #06b6d4
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Editor**: [Tiptap](https://tiptap.dev/) (ProseMirror-based)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: CSS transitions & keyframes

## 📝 Data Storage

Currently, NoteNova stores all data in your browser's LocalStorage:
- **Notes**: Full note content and metadata
- **Folders**: Folder structure and preferences
- **Tags**: Tag definitions and assignments

**Note**: Data persists across sessions but is limited to the current browser. For production use, this would be replaced with a cloud database (Supabase, Firebase, or custom backend).

## 🔮 Future Enhancements

### Phase 2 (Planned)
- [ ] Cloud backend integration (Supabase)
- [ ] Real AI features (OpenAI/Anthropic integration)
- [ ] User authentication
- [ ] Cloud sync across devices
- [ ] Markdown import/export
- [ ] PDF export with styling
- [ ] Public note sharing
- [ ] Code syntax highlighting
- [ ] Tables support

### Phase 3 (Future)
- [ ] Native mobile apps (iOS/Android)
- [ ] Offline-first with sync
- [ ] Version history
- [ ] Note templates
- [ ] Web clipper browser extension
- [ ] Plugin system
- [ ] Collaborative editing
- [ ] Knowledge graph visualization

## 🐛 Known Limitations

Since this is a front-end demo:
- Data stored locally (won't sync across devices)
- No user authentication
- AI features are UI-only (buttons ready, no backend)
- No cloud backup
- Limited to single browser/device

## 📄 License

This project was created as a demo for the NoteNova PRD. See the main PRD document for full product specifications.

## 🙏 Acknowledgments

- Design inspired by the beauty of the cosmos
- Built with amazing open-source tools
- Cosmic Night color palette created for this project

---

**Made with ✨ and cosmic inspiration**

For questions or feedback, please refer to the main PRD document or open an issue.
