import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Usuario } from '../models/Usuario';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';

export async function getEditorialesPendientes(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        if(Object.keys(req.params).length===0){
            const result = await select(`SELECT id_user FROM usuario WHERE status = 'ACTIVO' AND rol = 'EDITORIAL' and validado=0;`);
            const lista:Array<Usuario> = new Array<Usuario>();

            if(result.execute){
                for (let element of result.result){
                    const user:Usuario = new Usuario(element.id_user,'',0);
                    await user.existeUsuario();
                    lista.push(user);
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

export async function getUsers(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        if(Object.keys(req.params).length===0){
            const result = await select(`SELECT id_user FROM usuario WHERE status = 'ACTIVO';`);
            const lista:Array<Usuario> = new Array<Usuario>();

            if(result.execute){
                for (let element of result.result){
                    const user:Usuario = new Usuario(element.id_user,'',0);
                    await user.existeUsuario();
                    lista.push(user);
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

export async function bajaUsuario(req:Request, res:Response): Promise<Response> {
    if(req.body.idUser){
        return await actualizarUsuario(req,res,1)
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

export async function confirmarEditorial(req:Request, res:Response): Promise<Response> {
    if(req.body.idUser){
        return await actualizarUsuario(req,res,4)
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

export async function altaUsuario(req:Request, res:Response): Promise<Response> {
    if(req.body.idUser){
        return await actualizarUsuario(req,res,2)
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

export async function updateUsuario(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.primerNombre && req.body.password && req.body.rol && req.body.username){
        const user:Usuario = new Usuario(req.body.idUser,'',0);
        user.rol = req.body.rol;
        return await actualizarUsuario(req,res,3)
    }
    return res
        .status(400)
        .json(excepcion)
}

async function actualizarUsuario(req:Request, res:Response, op: number): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
            const user: Usuario = new Usuario(req.body.idUser,'',0);
            let validador:ResultadoEjecucion = await user.existeUsuario();
            // se valida que exista la linea
            if(validador.existe) {
                if(op==3){
                    user.primer_apellido = req.body.primerApellido
                    user.primer_nombre = req.body.primerNombre
                    user.segundo_nombre = req.body.segundoNombre
                    user.segundo_apellido = req.body.segundoApellido
                    user.rol = req.body.rol;
                    user.username = req.body.username;
                    user.telefono = req.body.telefono;
                    user.direccion = req.body.direccion;
                }
                    
                const result = await user.updateUsuario(op,req.body.password);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Usuario actualizado correctamente.'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'Registro no se ha actualizado'
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Usuario no existe!'
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

export async function saveUsuario(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    try{
        
        if(req.body.primerNombre && req.body.rol && req.body.username && req.body.password && req.body.telefono){
            let user: Usuario = new Usuario(0,req.body.username,0);
            user.primer_apellido = req.body.primerApellido
            user.primer_nombre = req.body.primerNombre
            user.segundo_nombre = req.body.segundoNombre
            user.segundo_apellido = req.body.segundoApellido
            user.rol = req.body.rol;
            user.username = req.body.username;
            user.telefono = req.body.telefono;
            user.direccion = req.body.direccion;
            
            if((await (user.existeUsername())).existe){
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
                excepcion.Message = 'El Correo ingresado, ya fue utilizado por un usuario previamente'
            }else{
                const result = await user.guardarUsuario(req.body.password);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Usuario almacenado correctamente'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'El usuario no se ha guardado, intente nuevamente'
            }
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

export async function getUsuario(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };

    if(req.params.usuario) {
        try {
            const user:Usuario = new Usuario(parseInt(req.params.usuario),'',0)
            let validador:ResultadoEjecucion = await user.existeUsuario();
            // se valida que exista la linea
            if(validador.existe) {
                return res.json(user); 
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Usuario no existe!'
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
        excepcion.Message = 'Parametro usuario Requerido'
    }

    return res
            .status(400)
            .json(excepcion)
}
