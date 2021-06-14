import { Router } from 'express';
import { registrarCompra } from '../controllers/compras.controller';

const router = Router();

router.route('/')
        .post(registrarCompra);

export default router;