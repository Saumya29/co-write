import {loadState as loadFromFile, saveState as saveToFile, type State} from './storage.js';

let state: State | null = null;
let writeQueue: Promise<void> = Promise.resolve();

export class VersionConflict extends Error {}

export async function initialize(): Promise<void> {
  state = await loadFromFile();
  console.log(`Initialized with version ${state.version}, ${state.steps.length} steps`);
}

async function getState(): Promise<State> {
  if (!state) state = await loadFromFile();
  return state;
}

export async function getVersion(): Promise<number> {
  return (await getState()).version;
}

export async function getEvents(fromVersion: number): Promise<{steps: unknown[]; clientIDs: string[]}> {
  const current = await getState();
  return {steps: current.steps.slice(fromVersion), clientIDs: current.stepClientIDs.slice(fromVersion)};
}

// Checking the version and committing the steps must be one operation. A stale
// client gets a conflict, pulls the winner's steps, and rebases before retrying.
export function appendEvents(expectedVersion: number, steps: unknown[], clientIDs: string[]): Promise<number> {
  const operation = writeQueue.then(async () => {
    const current = await getState();
    if (expectedVersion !== current.version) {
      throw new VersionConflict(`Version mismatch: expected ${current.version}, got ${expectedVersion}`);
    }
    const next: State = {
      version: current.version + steps.length,
      steps: [...current.steps, ...steps],
      stepClientIDs: [...current.stepClientIDs, ...clientIDs],
    };
    await saveToFile(next);
    state = next;
    return next.version;
  });
  // A failed write must not poison the queue or publish unpersisted state.
  writeQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
