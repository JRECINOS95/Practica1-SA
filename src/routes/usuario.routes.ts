import { Router } from 'express';
import { getUsers, getUsuario, saveUsuario, updateUsuario, altaUsuario, bajaUsuario } from '../controllers/usuario.controller';

const router = Router();

router.route('/')
        .get(getUsers)
        .post(saveUsuario)
        .put(updateUsuario);

router.route('/baja')
        .put(bajaUsuario);

router.route('/alta')
        .put(altaUsuario);

router.route('/:usuario')
        .get(getUsuario);


export default router;