import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Transaccion } from '../models/Transaccion';
import { select } from '../utils/database';

export async function getTransacciones(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        const result = await select(`SELECT * FROM bitacora_libro;`);
        const lista:Array<Transaccion> = new Array<Transaccion>();

        if(result.execute){
            for (let element of result.result){
                const transaccion:Transaccion = new Transaccion(element.id_bitacora,element.id_libro,element.id_user,element.operacion);
                lista.push(transaccion);
            }
            return res.json(lista);
        }else{
            excepcion.Message = 'Error al ejecutar la consulta'
            excepcion.Code = 3
            excepcion.ErrorType = 'NEG'
        }
    } catch(error) {
        excepcion.Code = 999
        excepcion.ErrorType = 'DES'
        excepcion.Message = error
    }

    return res
            .status(400)
            .json(excepcion)
} 

export async function registrarBitacora(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.idLibro && req.body.idUser && req.body.operacion){
            let transaccion: Transaccion = new Transaccion(0,req.body.idLibro,req.body.idUser, req.body.operacion);
            const result = await transaccion.guardarTransaccion();
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Transaccion almacenada correctamente'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'La transaccion no se ha guardado, intente nuevamente, '+result.error;
        }else{
            excepcion.Code = 1
            excepcion.ErrorType = 'DES'
            excepcion.Message = 'Request no Valido!'
        }
    }catch(error){
        excepcion.Code = 999
        excepcion.ErrorType = 'DES'
        excepcion.Message = error
    }

    return res
            .status(400)
            .json(excepcion)

}