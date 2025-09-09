# Persistence Setup

## Current Implementation

**File-based persistence** at `server/data/state.json`

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

## Horizontal Scaling

**Current limitation:** File-based storage is NOT horizontally scalable.

### Production Options

| Solution       | Use Case         | Latency | Scale  |
| -------------- | ---------------- | ------- | ------ |
| **Redis**      | Real-time collab | <1ms    | High   |
| **PostgreSQL** | History/audit    | ~5ms    | Medium |
| **MongoDB**    | Document storage | ~3ms    | High   |

### Recommended Architecture

```
Redis (hot data) + PostgreSQL (cold storage)
- Redis: Active sessions, recent steps
- PostgreSQL: Full history, analytics
- Supports millions of concurrent users
```

## Migration Path

The DAO interface makes swapping storage backends trivial:

```javascript
// Current
export async function appendEvents(steps, clientIDs) {
  // File implementation
}

// Future: Just change the implementation
export async function appendEvents(steps, clientIDs) {
  await redis.rpush('steps', JSON.stringify(steps));
}
```

No changes needed in controllers or routes.
