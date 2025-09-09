import {Router} from 'express';
import * as controller from './controller.js';

const router = Router();

router.get('/events', controller.getEvents);
router.post('/events', controller.postEvents);
router.get('/version', controller.getVersion);

export default router;
