import {loadState as loadFromFile, saveState as saveToFile, type State} from './storage.js';

let state: State | null = null;

export async function initialize(): Promise<void> {
  state = await loadFromFile();
  console.log(`Initialized with version ${state.version}, ${state.steps.length} steps`);
}

async function getState(): Promise<State> {
  if (!state) {
    state = await loadFromFile();
  }
  return state;
}

async function saveState(newState: State): Promise<void> {
  state = newState;
  await saveToFile(newState);
}

export async function getVersion(): Promise<number> {
  const currentState = await getState();
  return currentState.version;
}

export async function getEvents(
  fromVersion: number
): Promise<{steps: unknown[]; clientIDs: string[]}> {
  const currentState = await getState();
  return {
    steps: currentState.steps.slice(fromVersion),
    clientIDs: currentState.stepClientIDs.slice(fromVersion),
  };
}

export async function appendEvents(steps: unknown[], clientIDs: string[]): Promise<void> {
  const currentState = await getState();
  currentState.steps.push(...steps);
  currentState.stepClientIDs.push(...clientIDs);
  currentState.version += steps.length;
  await saveState(currentState);
}
