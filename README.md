# ✍️ CoWrite

**Real-time collaborative document editor** — Google Docs-style editing powered by ProseMirror's operational transformation.

🔗 **[Live Demo](https://co-write-six.vercel.app)** · [API Server](https://co-write-production.up.railway.app/health)

---

## ✨ Features

- **Rich Text Editing** — Full formatting with TipTap (bold, italic, headings, lists, links, images)
- **Real-time Collaboration** — Multiple users editing simultaneously with conflict resolution
- **Live Word Count** — Character and word statistics updated in real-time
- **Persistence** — Documents survive server restarts
- **Operational Transformation** — ProseMirror's battle-tested collab algorithm

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, TipTap, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **Collaboration** | ProseMirror collab plugin (OT-based) |
| **Deployment** | Vercel (client), Railway (server) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repo
git clone https://github.com/Saumya29/co-write.git
cd co-write

# Start the server
cd server
npm install
npm run dev
# → http://localhost:4000

# Start the client (new terminal)
cd client
npm install
npm run dev
# → http://localhost:3000
```

Open multiple browser tabs to test collaboration!

## 📁 Project Structure

```
co-write/
├── client/                 # React + TipTap frontend
│   ├── src/
│   │   ├── components/     # Editor, Toolbar, MenuBar
│   │   ├── hooks/          # useCollaboration, useEditor
│   │   ├── api/            # Collaboration API client
│   │   └── lib/            # Utilities
│   └── README.md
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   └── collaboration/
│   │   ├── routes.ts
│   │   └── index.ts
│   └── data/               # Persistence (state.json)
│
└── README.md
```

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/version` | GET | Get current document version |
| `/api/events?version={n}` | GET | Get steps since version n |
| `/api/events` | POST | Submit new steps |

### POST `/api/events` Body
```json
{
  "version": 5,
  "steps": [...],
  "clientID": "abc123"
}
```

## 🏗 Architecture

### Why HTTP Polling over WebSockets?

Following ProseMirror's official collab example — HTTP polling is simpler, avoids reconnection complexity, and works well for collaborative editing. The 1-second polling interval provides near-real-time updates. WebSockets can be added later for lower latency.

### Why Operational Transformation?

ProseMirror's OT algorithm handles concurrent edits gracefully. When two users type simultaneously, their changes are transformed to maintain consistency across all clients.

### Scaling Considerations

**Current:** File-based persistence (`server/data/state.json`) — great for prototypes.

**Production path:**
- PostgreSQL for ACID transactions and ordered step storage
- Redis for caching recent steps
- Database constraints to enforce step ordering across multiple servers

## 🎯 Implementation Checklist

- [x] TipTap editor with rich text formatting
- [x] Live word/character counter
- [x] ProseMirror collab plugin integration
- [x] Step synchronization between clients
- [x] Document state catch-up on reload
- [x] Debounced step sending (300ms)
- [x] File-based persistence
- [x] Automatic state recovery on startup
- [ ] User cursors/presence
- [ ] Multiple documents
- [ ] User authentication

## 🚢 Deployment

### Client (Vercel)
1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. Set **Framework** to `Vite`
4. Add env: `VITE_API_URL=https://your-server.railway.app/api`

### Server (Railway)
1. Create project on [railway.app](https://railway.app)
2. Connect GitHub repo
3. Set **Root Directory** to `server`
4. Build: `npm install && npm run build`
5. Start: `npm start`

---

Built by [Saumya Tiwari](https://github.com/Saumya29)
