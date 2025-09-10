# Collaborative Editor Client

Real-time collaborative text editor built with React, TypeScript, and TipTap (ProseMirror).

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TipTap/ProseMirror** - Rich text editing engine
- **ProseMirror Collab** - Operational transformation for real-time collaboration
- **Vite** - Build tool with HMR

## Features

- Rich text editing with full formatting options (based on TipTap's SimpleEditor template)
- Real-time collaborative editing
- Live word count
- Persistent document state
- Automatic reconnection and sync

## TipTap Extensions Used

- **StarterKit**: Basic editing features (bold, italic, lists, headings, etc.)
- **CharacterCount**: Provides live word and character counting (using TipTap's built-in extension for accuracy and performance instead of custom implementation)
- **Placeholder**: Shows placeholder text when editor is empty
- **TextAlign**: Text alignment controls
- **Highlight**: Text highlighting capability
- **Typography**: Smart quotes and typographic improvements
- **Image**: Image support with upload handling
- **Subscript/Superscript**: Scientific notation support
- **ProseMirrorCollab**: Custom extension for collaboration with version tracking

## Project Structure

```
client/
├── src/
│   ├── api/              # API client for collaboration endpoints
│   ├── components/       # React components
│   │   └── tiptap-templates/  # Editor UI components
│   ├── extensions/       # TipTap/ProseMirror extensions
│   ├── hooks/           # Custom React hooks
│   │   └── use-collaboration.ts  # Core collaboration logic
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
└── public/              # Static assets
```

## Key Components

### `use-collaboration.ts`

Handles the real-time collaboration logic:

- Syncs document state with server
- Applies remote changes via operational transformation
- Debounces local changes before sending (300ms)
- Only sends steps when there are actual changes
- Manages version tracking to prevent duplicates

### `ProseMirrorCollab` Extension

Integrates ProseMirror's collaboration plugin with TipTap for version tracking and step management.

### Client ID

Uses `nanoid` to generate unique client IDs for each session - lightweight and collision-resistant, helps track which client sent which steps.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## Environment

The client connects to the backend API at `http://localhost:4000` by default. Update the API endpoints in `src/api/collaboration.ts` if your server runs on a different port.
