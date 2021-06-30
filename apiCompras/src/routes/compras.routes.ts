import { Router } from 'express';
import { actualizarEnvio, getTracking, getTrackingCliente, registrarCompra } from '../controllers/compras.controller';

const router = Router();

router.route('/')
        .post(registrarCompra);

router.route('/tracking/:cliente')
        .get(getTrackingCliente);

router.route('/tracking')
        .get(getTracking)
        .put(actualizarEnvio);

export default router;