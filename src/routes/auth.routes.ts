import { Router } from 'express';
import { login, resetPassworrd, changePassword } from '../controllers/auth.controller';
const router = Router();

router.route('/')
        .post(login)
        .put(changePassword);

router.route('/reset')
        .post(resetPassworrd)

export default router;