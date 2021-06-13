import { Router } from 'express';
// eslint-disable-next-line import/no-unresolved
import { indexStatus } from '../controllers/index.controller';

const router = Router();

router.route('/status').get(indexStatus);

export default router;
