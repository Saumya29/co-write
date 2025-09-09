import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(currentDir, '../../..')
const DATA_FILE = path.join(serverRoot, 'data', 'state.json')

export interface State {
  version: number
  steps: unknown[]
  stepClientIDs: string[]
}

export async function loadState(): Promise<State> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { version: 0, steps: [], stepClientIDs: [] }
  }
}

export async function saveState(state: State): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(state))
    console.log(`State saved to ${DATA_FILE}`)
  } catch (error) {
    console.error('Failed to save state:', error)
    throw error
  }
}