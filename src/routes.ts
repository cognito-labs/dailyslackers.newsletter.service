import { Router } from 'express';

import * as SubscriberController from './controllers/subscriber';

const router = Router();

router.post('/subscriber/add', SubscriberController.add);

export default router;