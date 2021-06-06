import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { Password } from '../models/Password';

export async function login(req:Request, res:Response): Promise<Response>{
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    if(req.body.user && req.body.password) {
        try {
            const pass:Password = new Password()
            let validador:ResultadoEjecucion = await pass.validarContraseña(req.body.user,req.body.password);
            // se valida que exista la linea
            if(validador.existe) {
                return res.json(pass); 
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Usuario y/ Contraseña Incorrecto'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
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

export function resetPassworrd(req:Request, res:Response): Response{
    return res.json('Api Base Funcionando');
}

export async function changePassword(req:Request, res:Response): Promise<Response>{
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    if(req.body.user && req.body.newPassword && req.body.oldPassword) {
        try {
            const pass:Password = new Password()
            let validador:ResultadoEjecucion = await pass.cambiarContraseña(req.body.user,req.body.oldPassword,req.body.newPassword);
            // se valida que exista la linea
            if(validador.ejecutado) {
                return res.json({
                    Code: 0,
                    Message: 'Contraseña actualizada correctamente'
                });
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Usuario y/ Contraseña Incorrecto'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
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