import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Transaccion } from '../models/Transaccion';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';
import { Tracking } from '../models/Tracking';

export async function getTracking(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        const result = await select(`select m.id_medio_envio, m.status, t.id_transaccion, t.cantidad, t.valor_final, u.primer_nombre, u.primer_apellido, l.nombre as libro from transaccion t inner join usuario u on u.id_user = t.id_user inner join libro l on l.id_libro = t.id_libro inner join medio_envio m on m.id_transaccion = t.id_transaccion;`);
        const lista:Array<any> = new Array<any>();
        if(result.execute){
            for (let element of result.result){
                lista.push({
                    id: element.id_medio_envio,
                    status: element.status,
                    id_transaccion: element.id_transaccion,
                    cantidad: element.cantidad,
                    valor_final: element.valor_final,
                    primer_nombre: element.primer_nombre,
                    primer_apellido: element.primer_apellido,
                    libro: element.libro
                });
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



export async function actualizarEnvio(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.id  && req.body.status){
            let transaccion: Tracking = new Tracking(req.body.id,0,req.body.status);
            const result = await transaccion.updateStatus();
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Transaccion actualizada correctamente'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'La transaccion no se ha actualizado, intente nuevamente'
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

export async function registrarCompra(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.idLibro && req.body.idUser && req.body.cantidad && req.body.tipoPago){
            let transaccion: Transaccion = new Transaccion(0,req.body.idLibro,req.body.idUser);
            transaccion.tarjeta = req.body.tarjeta;
            transaccion.tipoPago = req.body.tipoPago;
            transaccion.cantidad = req.body.cantidad;
            transaccion.cvv = req.body.cvv;
            transaccion.valorFinal = req.body.valorFinal;
            transaccion.valorImpuestos = req.body.valorImpuestos;
            transaccion.valorUnitario = req.body.valorUnitario;

            const result = await transaccion.guardarTransaccion(req.body.direccion);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Transaccion almacenada correctamente'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'La transaccion no se ha guardado, intente nuevamente'
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