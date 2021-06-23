import { Router } from 'express';
import { registrarBitacora, getTransacciones } from '../controllers/bitacoras.controller';

const router = Router();

router.route('/')
        .get(getTransacciones)
        .post(registrarBitacora);

export default router;