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
- [ ] Live word counter

### FEATURE-2: Collaboration
- [ ] ProseMirror collab plugin integration
- [ ] Backend API endpoints for collaboration
- [ ] Step synchronization between clients
- [ ] Document state catch-up on reload

### FEATURE-3: Persistence
- [ ] Step storage across server restarts
- [ ] Ordered step validation

## API Endpoints

(To be implemented)

- `GET /steps/:version` - Get steps since version
- `POST /steps` - Submit new steps
- `GET /document` - Get current document state

## Notes

This project implements collaborative editing using ProseMirror's operational transformation algorithm. The backend focuses on ordered storage and replay of steps without recreating ProseMirror state on the server.