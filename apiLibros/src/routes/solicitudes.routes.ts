import { Router } from 'express';
import { altaSolicitud, bajaSolicitud, getSolicitud, getSolicitudes, saveSolicitud, updateSolicitud } from '../controllers/solicitudes.controller';

const router = Router();

router.route('/')
        .post(saveSolicitud)
        .put(updateSolicitud)
        .get(getSolicitudes);

router.route('/baja')
        .put(bajaSolicitud);

router.route('/alta')
        .put(altaSolicitud);

router.route('/:solicitud')
        .get(getSolicitud);



export default router;