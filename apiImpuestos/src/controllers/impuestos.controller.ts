import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { select } from '../utils/database';

export async function getImpuestos(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        const result = await select(`SELECT *  FROM impuestos;`);
        const lista:Array<any> = new Array<any>();

        if(result.execute){
            for (let element of result.result){
                lista.push({
                    id: element.id_impuesto,
                    pais: element.pais,
                    impuesto: element.impuestos
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