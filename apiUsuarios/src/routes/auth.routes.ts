import { Router } from 'express';
import { login } from '../controllers/auth.controller';
const router = Router();

router.route('/')
        .post(login);

export default router;