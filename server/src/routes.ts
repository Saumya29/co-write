import { Router } from 'express'
import { collabRoutes } from './modules/collaboration/index.js'

const router = Router()

router.use('/', collabRoutes)

export default router