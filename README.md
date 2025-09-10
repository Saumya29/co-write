# Cadmus Collaborative Editor

A real-time collaborative text editor built with ProseMirror/TipTap and a backend API for operational transformation-based collaboration.

## Project Structure

```
cadmus-editor/
├── client/          # React + TypeScript + TipTap editor
│   └── README.md    # Detailed client implementation docs
└── server/          # Backend API server (TypeScript/Node.js)
    └── PERSISTENCE_SETUP.md  # Persistence testing guide
```

## Features

- **Rich Text Editor**: Full-featured text editor using TipTap (ProseMirror-based)
- **Live Word Counter**: Real-time word count display
- **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- **Persistence**: Document state and steps are saved across server restarts

## Requirements

- Node.js (v16+ minimum, v18+ recommended)
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
- HTTP API for collaboration (polling-based)
- File-based persistence
- Modular architecture (DAO/Controller separation)
- Feature-based modules structure

### Code Quality

- ESLint + Prettier for both client and server
- Husky with lint-staged for pre-commit hooks

## Implementation Status

### FEATURE-1: Online Editing Environment

- [x] TipTap editor with rich text capabilities
- [x] Live word counter

### FEATURE-2: Collaboration

- [x] ProseMirror collab plugin integration
- [x] Backend API endpoints for collaboration
- [x] Step synchronization between clients
- [x] Document state catch-up on reload
- [x] Debounced sending of steps (300ms delay)

### FEATURE-3: Persistence

- [x] Step storage across server restarts (file-based: `server/data/state.json`)
- [x] Ordered step validation
- [x] Automatic state recovery on server startup

## API Endpoints

- `GET /api/events?version={n}` - Get steps since version n
- `POST /api/events` - Submit new steps (body: {version, steps, clientID})
- `GET /api/version` - Get current version
- `GET /health` - Health check

## Persistence & Scaling

### Current Implementation

- File-based persistence (`server/data/state.json`)
- Steps survive server restarts
- Single server architecture

### Production Recommendations

For horizontal scaling with multiple servers:

I used simple file storage for the prototype since performance wasn't a priority here. But in production, writing every step to disk would create bottlenecks and fail with multiple concurrent editors. Plus, with horizontal scaling, each server would have its own file copy, leading to inconsistent document states. I'd use PostgreSQL since it provides ACID transactions and strict ordering essential for collaborative editing, while NoSQL databases have eventual consistency issues that can break step ordering. With proper indexing on document ID and version, you get reliable step storage and fast history lookups. For high-traffic documents, adding Redis to cache recent steps would help. The main scaling challenge is ensuring steps are processed in order across multiple servers: you'd need coordination or database constraints to reject out-of-order steps.

## Architecture Decisions

### REST API vs WebSockets

I chose HTTP polling following ProseMirror's collab documentation approach: it's simpler and avoids reconnection complexity. The 1-second polling works well for collaborative editing. WebSockets can be added later for instant updates and reduced server load with many concurrent users.

### Collaboration Approach

Used ProseMirror's collab plugin (operational transformation) as per requirements instead of TipTap's Yjs collaboration.

## Notes

This project implements collaborative editing using ProseMirror's operational transformation algorithm. The backend focuses on ordered storage and replay of steps without recreating ProseMirror state on the server.
