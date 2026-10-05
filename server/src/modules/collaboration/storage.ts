import {promises as fs} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(currentDir, '../../..');
const DATA_FILE = process.env.COWRITE_DATA_FILE || path.join(serverRoot, 'data', 'state.json');

export interface State {
  version: number;
  steps: unknown[];
  stepClientIDs: string[];
}

export async function loadState(): Promise<State> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const state = JSON.parse(data);
    if (!Number.isInteger(state.version) || state.version < 0 || !Array.isArray(state.steps) ||
        !Array.isArray(state.stepClientIDs) || state.steps.length !== state.version ||
        state.stepClientIDs.length !== state.version) throw new Error('Invalid collaboration state');
    return state;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    return {version: 0, steps: [], stepClientIDs: []};
  }
}

export async function saveState(state: State): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), {recursive: true});
    await fs.writeFile(`${DATA_FILE}.tmp`, JSON.stringify(state));
    await fs.rename(`${DATA_FILE}.tmp`, DATA_FILE);
    console.log(`State saved to ${DATA_FILE}`);
  } catch (error) {
    console.error('Failed to save state:', error);
    throw error;
  }
}
