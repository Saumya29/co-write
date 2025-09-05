import { Router } from 'express'
import * as collab from './collaboration.js'

const router = Router()

router.get('/events', (req, res) => {
  try {
    const fromVersion = Number(req.query.version) || 0
    const events = collab.getEvents(fromVersion)
    res.json(events)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/events', (req, res) => {
  const { version: clientVersion, steps: clientSteps, clientID } = req.body
  
  if (clientVersion === undefined || !Array.isArray(clientSteps) || !clientID) {
    return res.status(422).json({ error: 'Invalid input: version, steps[], and clientID required' })
  }
  
  const result = collab.addEvents(clientVersion, clientSteps, clientID)
  
  if ('error' in result) {
    return res.status(409).json(result)
  }
  
  res.json(result)
})

router.get('/version', (_, res) => {
  res.json(collab.getCurrentVersion())
})

export default router