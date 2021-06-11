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
            const result = await select(`SELECT id_user FROM usuario WHERE username='${req.body.user}' AND password='${req.body.password}' AND status = 'ACTIVO';`);
            if(result.execute){
                if(result.result.length>0){
                    const user:Usuario = new Usuario(result.result[0].id_user,'',0);
                    await user.existeUsuario();
                    return res.json(user);
                }   
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