import { Router } from 'express';
import { getLibros, bajaLibro, altaLibro, saveLibro, updateLibro,getLibro, getGeneros, getStockLibros } from '../controllers/libros.controller';

const router = Router();

router.route('/lista/:editorial')
        .get(getLibros);

router.route('/genero')
        .get(getGeneros);

router.route('/stock')
        .get(getStockLibros);

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