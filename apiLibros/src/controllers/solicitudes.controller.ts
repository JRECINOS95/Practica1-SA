import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { SolicitudLibro } from '../models/SolicitudLibro';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';

export async function getSolicitudes(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        const result = await select(`SELECT solicitud_libro FROM solicitud_libro WHERE status = 'ACTIVO'`);
        const lista:Array<SolicitudLibro> = new Array<SolicitudLibro>();

        if(result.execute){
            for (let element of result.result){
                const libro:SolicitudLibro = new SolicitudLibro(element.solicitud_libro,'');
                await libro.existeSolicitudLibro();
                lista.push(libro);
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

export async function bajaSolicitud(req:Request, res:Response): Promise<Response> {
    if(req.body.idSolicitud){
        return await actualizarSolicitud(req,res,1)
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

export async function altaSolicitud(req:Request, res:Response): Promise<Response> {
    if(req.body.idSolicitud){
        return await actualizarSolicitud(req,res,2)
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

export async function updateSolicitud(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idSolicitud && req.body.idEditorial){
        return await actualizarSolicitud(req,res,3)
    }
    return res
        .status(400)
        .json(excepcion)
}

async function actualizarSolicitud(req:Request, res:Response, op: number): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
            const solicitud: SolicitudLibro = new SolicitudLibro(req.body.idSolicitud,'');
            let validador:ResultadoEjecucion = await solicitud.existeSolicitudLibro();
            // se valida que exista la linea
            if(validador.existe) {
                if(op==3){
                    solicitud.idEditorial = req.body.idEditorial;
                }
                const result = await solicitud.updateSolicitudLibro(op);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Solicitud actualizada correctamente.'
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

export async function saveSolicitud(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.nombre && req.body.autor && req.body.idUser && req.body.file && req.body.fecha){
            let solicitud: SolicitudLibro = new SolicitudLibro(0,req.body.nombre);
            solicitud.nombre = req.body.nombre
            solicitud.file = req.body.file;
            solicitud.idUser = req.body.idUser;
            solicitud.fechaPublicacion = req.body.fecha;
            solicitud.autor = req.body.autor;
           
            const result = await solicitud.guadarSolicitudLibro();
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Solicitud almacenada correctamente'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'La solicitud no se ha guardado, intente nuevamente'
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

export async function getSolicitud(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    if(req.params.solicitud) {
        try {
            const solicitud:SolicitudLibro = new SolicitudLibro(parseInt(req.params.solicitud),'')
            let validador:ResultadoEjecucion = await solicitud.existeSolicitudLibro();
            // se valida que exista la linea
            if(validador.existe) {
                return res.json(solicitud); 
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Solicitud no existe!'
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
        excepcion.Message = 'Parametro solicitud Requerido'
    }

    return res
            .status(400)
            .json(excepcion)
}
