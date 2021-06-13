import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Libro } from '../models/Libro';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';

export async function getLibros(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        if(req.params.editorial){
            const result = await select(`SELECT id_libro FROM libro WHERE status != 'INACTIVO' AND id_user=${req.params.editorial};`);
            const lista:Array<Libro> = new Array<Libro>();

            if(result.execute){
                for (let element of result.result){
                    const libro:Libro = new Libro(element.id_libro,'');
                    await libro.existeLibro();
                    lista.push(libro);
                }
                return res.json(lista);
            }else{
                excepcion.Message = 'Error al ejecutar la consulta'
                excepcion.Code = 3
                excepcion.ErrorType = 'NEG'
            }
        }else{
            excepcion.Message = 'Request no valido!'
            excepcion.Code = 1
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

export async function bajaLibro(req:Request, res:Response): Promise<Response> {
    if(req.body.idLibro){
        return await actualizarLibro(req,res,1)
    }else{
        const excepcion:Excepcion = {
            Code: 1,
            ErrorType: 'DES',
            Message: 'Request no Valido!'
        }
        return res
            .status(400)
            .json(excepcion)
    }
}

export async function altaLibro(req:Request, res:Response): Promise<Response> {
    if(req.body.idLibro){
        return await actualizarLibro(req,res,2)
    }else{
        const excepcion:Excepcion = {
            Code: 1,
            ErrorType: 'DES',
            Message: 'Request no Valido!'
        }
        return res
            .status(400)
            .json(excepcion)
    }
}

export async function updateLibro(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idLibro && req.body.nombre && req.body.stock && req.body.url){
        return await actualizarLibro(req,res,3)
    }
    return res
        .status(400)
        .json(excepcion)
}

async function actualizarLibro(req:Request, res:Response, op: number): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
            const libro: Libro = new Libro(req.body.idLibro,'');
            let validador:ResultadoEjecucion = await libro.existeLibro();
            // se valida que exista la linea
            if(validador.existe) {
                if(op==3){
                    libro.nombre = req.body.nombre
                    libro.url = req.body.url;
                    libro.stock = req.body.stock;
                }
                const result = await libro.updateLibro(op);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Libro actualizado correctamente.'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'Registro no se ha actualizado'
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Libro no existe!'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
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

export async function saveLibro(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.nombre && req.body.url && req.body.idUser && req.body.stock && req.body.autor){
            let libro: Libro = new Libro(0,req.body.nombre);
            libro.nombre = req.body.nombre
            libro.url = req.body.url;
            libro.idUser = req.body.idUser;
            libro.stock = req.body.stock;
            libro.autor = req.body.autor;
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

export async function getLibro(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    if(req.params.libro) {
        try {
            const user:Libro = new Libro(parseInt(req.params.libro),'')
            let validador:ResultadoEjecucion = await user.existeLibro();
            // se valida que exista la linea
            if(validador.existe) {
                return res.json(user); 
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Libro no existe!'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
    
            // se valida errores en consulta para generar excepcion de tipo 3
            if(validador.error!==null) {
                excepcion.Message = 'Error al ejecutar la consulta'
                excepcion.Code = 3
                excepcion.ErrorType = 'NEG'
            }
        } catch (error) {
            excepcion.Code = 999
            excepcion.ErrorType = 'DES'
            excepcion.Message = error
        }
    } else {
        excepcion.Message = 'Parametro libro Requerido'
    }

    return res
            .status(400)
            .json(excepcion)
}
