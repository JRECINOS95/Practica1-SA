import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Libro } from '../models/Libro';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';


export async function registrarCompra(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.idLibro && req.body.idCliente && req.body.cantidad && req.body.tipoPago){
            let libro: Libro = new Libro(0,req.body.nombre);
            libro.nombre = req.body.nombre
            libro.url = req.body.url;
            libro.idUser = req.body.idUser;
            libro.stock = req.body.stock;
            libro.autor = req.body.autor;
            libro.precio = req.body.precio;
            const result = await libro.guadarLibro();
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Libro almacenado correctamente'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'El libro no se ha guardado, intente nuevamente'
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