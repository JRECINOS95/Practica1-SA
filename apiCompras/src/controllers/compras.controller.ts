import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Transaccion } from '../models/Transaccion';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';


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