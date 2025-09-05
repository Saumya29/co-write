let version = 0
let steps: unknown[] = []
let stepClientIDs: string[] = []

export function getVersion(): number {
  return version
}

export function getEvents(fromVersion: number) {
  if (fromVersion < 0 || fromVersion > version) {
    throw new Error(`Invalid version: ${fromVersion}`)
  }

  return {
    version,
    steps: steps.slice(fromVersion),
    clientIDs: stepClientIDs.slice(fromVersion)
  }
}

export function addEvents(clientVersion: number, clientSteps: unknown[], clientID: string) {
  if (clientVersion !== version) {
    return {
      error: `Version mismatch: expected ${version}, got ${clientVersion}`
    }
  }

  for (const step of clientSteps) {
    steps.push(step)
    stepClientIDs.push(clientID)
    version++
  }

  console.log(`Added ${clientSteps.length} steps from ${clientID}, new version: ${version}`)

  return { version }
}

export function getCurrentVersion() {
  return {
    version
  }
}