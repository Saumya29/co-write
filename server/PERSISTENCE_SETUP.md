# Persistence Setup

## Current Implementation

File-based persistence at `server/data/state.json`

- Auto-loads on server start
- Saves on every POST `/api/events`
- Zero configuration required

## Testing

```bash
# Start server
npm run dev

# Type in editor at http://localhost:3000
# Restart server (Ctrl+C, npm run dev)
# Refresh browser - content persists
```

## File Structure

```
server/
├── data/
│   └── state.json  (auto-created)
└── src/
```

The `data` directory is gitignored to prevent committing document data.
