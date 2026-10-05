import {Request, Response} from 'express';
import * as dao from './dao.js';

export async function getEvents(req: Request, res: Response) {
  try {
    const fromVersion = Number(req.query.version ?? 0);
    const currentVersion = await dao.getVersion();

    if (!Number.isInteger(fromVersion) || fromVersion < 0 || fromVersion > currentVersion) {
      return res.status(400).json({error: `Invalid version: ${fromVersion}`});
    }

    const {steps, clientIDs} = await dao.getEvents(fromVersion);

    if (steps.length > 0) {
      console.log(`Sending ${steps.length} steps from version ${fromVersion} to ${currentVersion}`);
    }

    res.json({
      version: currentVersion,
      steps,
      clientIDs,
    });
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
}

export async function postEvents(req: Request, res: Response) {
  try {
    const {version: clientVersion, steps: clientSteps, clientID} = req.body;

    if (!Number.isInteger(clientVersion) || clientVersion < 0 || !Array.isArray(clientSteps) || !clientSteps.length || typeof clientID !== 'string' || !clientID.trim()) {
      return res.status(422).json({error: 'Invalid input: version, steps, and clientID required'});
    }

    const clientIDs = new Array(clientSteps.length).fill(clientID);
    const version = await dao.appendEvents(clientVersion, clientSteps, clientIDs);
    res.json({version});
  } catch (error: any) {
    if (error instanceof dao.VersionConflict) return res.status(409).json({error: error.message});
    res.status(500).json({error: error.message});
  }
}

export async function getVersion(_req: Request, res: Response) {
  try {
    const version = await dao.getVersion();
    res.json({version});
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}
