import { Request, Response } from 'express'
import * as dao from './dao.js'

export async function getEvents(req: Request, res: Response) {
  try {
    const fromVersion = Number(req.query.version) || 0
    const currentVersion = await dao.getVersion()
    
    if (fromVersion < 0 || fromVersion > currentVersion) {
      return res.status(400).json({ error: `Invalid version: ${fromVersion}` })
    }

    const { steps, clientIDs } = await dao.getEvents(fromVersion)
    
    if (steps.length > 0) {
      console.log(`Sending ${steps.length} steps from version ${fromVersion} to ${currentVersion}`)
    }
    
    res.json({
      version: currentVersion,
      steps,
      clientIDs
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export async function postEvents(req: Request, res: Response) {
  try {
    const { version: clientVersion, steps: clientSteps, clientID } = req.body
    
    if (clientVersion === undefined || !Array.isArray(clientSteps) || !clientID) {
      return res.status(422).json({ error: 'Invalid input: version, steps, and clientID required' })
    }
    
    const currentVersion = await dao.getVersion()
    
    if (clientVersion !== currentVersion) {
      console.log(`Version mismatch: server=${currentVersion}, client=${clientVersion}`)
      return res.status(409).json({ 
        error: `Version mismatch: expected ${currentVersion}, got ${clientVersion}` 
      })
    }

    const clientIDs = new Array(clientSteps.length).fill(clientID)
    
    console.log(`Adding ${clientSteps.length} steps from ${clientID}, new version: ${currentVersion + clientSteps.length}`)
    if (clientSteps.length > 0) {
      console.log('Step sample:', JSON.stringify(clientSteps[0]).substring(0, 200))
    }
    
    await dao.appendEvents(clientSteps, clientIDs)
    
    res.json({ version: currentVersion + clientSteps.length })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getVersion(_req: Request, res: Response) {
  try {
    const version = await dao.getVersion()
    res.json({ version })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}