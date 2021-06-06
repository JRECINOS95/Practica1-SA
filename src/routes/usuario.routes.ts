import { Router } from 'express';
import { getUsers, getUsuario, saveUsuario, updateUsuario, altaUsuario, bajaUsuario } from '../controllers/usuario.controller';
import { altaCorreo, bajaCorreo, updateCorreo, guardarNuevoCorreo } from '../controllers/usuario.controller';
import { altaTelefono, bajaTelefono, updateTelefono,guardarNuevoTelefono } from '../controllers/usuario.controller';

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

router.route('/telefono')
        .post(guardarNuevoTelefono)
        .put(updateTelefono);

router.route('/telefono/baja')
        .put(bajaTelefono);

router.route('/telefono/alta')
        .put(altaTelefono);

router.route('/correo')
        .post(guardarNuevoCorreo)
        .put(updateCorreo);

router.route('/correo/baja')
        .put(bajaCorreo);

router.route('/correo/alta')
        .put(altaCorreo);

export default router;