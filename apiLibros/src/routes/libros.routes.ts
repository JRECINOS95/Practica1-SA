import { Router } from 'express';
import { getLibros, bajaLibro, altaLibro, saveLibro, updateLibro,getLibro } from '../controllers/libros.controller';

const router = Router();

router.route('/lista/:editorial')
        .get(getLibros);

router.route('/baja')
        .put(bajaLibro);

router.route('/alta')
        .put(altaLibro);

router.route('/')
        .post(saveLibro)
        .put(updateLibro);

router.route('/:libro')
        .get(getLibro);

export default router;