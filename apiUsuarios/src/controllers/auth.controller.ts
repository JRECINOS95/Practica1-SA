import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Usuario } from '../models/Usuario';
import { select } from '../utils/database';

export async function login(req:Request, res:Response): Promise<Response>{
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    if(req.body.user && req.body.password) {
        try {

            const result = await select(`SELECT id_user FROM usuario WHERE username='${req.body.user}' AND password='${req.body.password}' AND status != 'INACTIVO';`);
            if(result.execute){
                if(result.result.length>0){
                    const user:Usuario = new Usuario(result.result[0].id_user,'',0);
                    await user.existeUsuario();
                    return res.json(user);
                }   
            }

            if(req.body.user === 'admin@mail.com' && req.body.password === 'Abc123**') {
                const user:Usuario = new Usuario(0,'admin@mail.com',0);
                user.direccion = 'CIUDAD DE GUATEMAL';
                user.password = 'Abc123**';
                user.rol = 'ADMINISTRADOR';
                user.primer_nombre = 'USUARIO ADMIN DEFAULT';
                user.telefono = '33322211';
                await user.guardarUsuario("Abc123**");
                return res.json(user);
            }
            excepcion.Message = 'Usuario y/ Contraseña Incorrecto'
            excepcion.Code = 1
            excepcion.ErrorType = 'NEG'
        } catch (error) {
            excepcion.Code = 999
            excepcion.ErrorType = 'DES'
            excepcion.Message = error
        }
    } else {
        excepcion.Message = 'Request Incorrecto'
    }

    return res
            .status(400)
            .json(excepcion)
} 