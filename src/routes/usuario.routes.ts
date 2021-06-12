import { Router } from 'express';
import { getUsers, getUsuario, getEditorialesPendientes, saveUsuario, updateUsuario, altaUsuario, bajaUsuario, confirmarEditorial } from '../controllers/usuario.controller';

const router = Router();

router.route('/')
        .get(getUsers)
        .post(saveUsuario)
        .put(updateUsuario);

router.route('/editoriales')
        .post(getEditorialesPendientes);

router.route('/baja')
        .put(bajaUsuario);

router.route('/alta')
        .put(altaUsuario);

router.route('/confirmar')
        .put(confirmarEditorial);

router.route('/:usuario')
        .get(getUsuario);


export default router;