# Cadmus Collaborative Editor

A real-time collaborative text editor built with ProseMirror/TipTap and a backend API for operational transformation-based collaboration.

## Project Structure

```
cadmus-editor/
├── client/          # React + TypeScript + TipTap editor
└── server/          # Backend API server (TypeScript/Node.js)
```

## Features

- **Rich Text Editor**: Full-featured text editor using TipTap (ProseMirror-based)
- **Live Word Counter**: Real-time word count display
- **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- **Persistence**: Document state and steps are saved across server restarts

## Requirements

- Node.js (v18+)
- npm or yarn

## Getting Started

### Client Setup

```bash
cd client
npm install
npm run dev
```

The client will run on `http://localhost:3000`

### Server Setup

```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:4000`

## Development

### Client
- Built with React + TypeScript
- Uses TipTap editor framework (ProseMirror-based)
- Vite for development and building

### Server
- Node.js + TypeScript
- WebSocket/HTTP API for collaboration
- File-based or in-memory persistence

## Implementation Status

### FEATURE-1: Online Editing Environment
- [x] TipTap editor with rich text capabilities
- [x] Live word counter

### FEATURE-2: Collaboration
- [x] ProseMirror collab plugin integration
- [x] Backend API endpoints for collaboration
- [x] Step synchronization between clients
- [x] Document state catch-up on reload
- [ ] Debounce the sending of steps (optional)

### FEATURE-3: Persistence
- [ ] Step storage across server restarts
- [ ] Ordered step validation

## API Endpoints

- `GET /api/events?version={n}` - Get steps since version n
- `POST /api/events` - Submit new steps (body: {version, steps, clientID})
- `GET /api/version` - Get current version
- `GET /health` - Health check

## Notes

This project implements collaborative editing using ProseMirror's operational transformation algorithm. The backend focuses on ordered storage and replay of steps without recreating ProseMirror state on the server.