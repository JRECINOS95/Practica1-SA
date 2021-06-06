import {Request , Response} from 'express';
import { Excepcion } from '../interface/Excepcion';
import { Usuario } from '../models/Usuario';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { select } from '../utils/database';
import { Password } from '../models/Password';
import { Telefono } from '../models/Telefono';
import { Email } from '../models/Email';
import { ResultQuery } from '../interface/ResultQuery';

export async function getUsers(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try {
        if(Object.keys(req.params).length===0){
            const result = await select('SELECT id_user FROM usuario;');
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
    if(req.body.idUser && req.body.downUser){
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

export async function updateCorreo(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.idCorreo && req.body.correo && req.body.tipo){
        return actualizarCorreo(req,res,3);
    }
    return res
        .status(400)
        .json(excepcion)
}

export async function altaCorreo(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.idCorreo){
        return actualizarCorreo(req,res,2);
    }
    return res
        .status(400)
        .json(excepcion)
}

export async function bajaCorreo(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.idCorreo && req.body.downUser){
        return actualizarCorreo(req,res,1);
    }
    return res
        .status(400)
        .json(excepcion)
}


export async function guardarNuevoCorreo(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try
    {

        if(!req.body.idUser || !req.body.correo || !req.body.tipo || !req.body.userCreate){
            excepcion.ErrorType= 'NEG',
            excepcion.Message= 'Request no Valido!'
            excepcion.Code= 1
            return res
                .status(400)
                .json(excepcion)
        }

        const user:Usuario = new Usuario(req.body.idUser,'',0);
        if((await (user.existeUsuario())).existe){
            const mail:Email = new Email(0,req.body.correo,req.body.userCreate,req.body.idUser);
            const result:ResultQuery = await select(`SELECT 1 FROM usuario_correo where id_user=${user.ID} AND correo ='${req.body.correo}'`)
            // se valida que exista la linea
            if(result.result.length === 0) {
                mail.type = req.body.tipo;
                const resultado = await mail.guardarCorreo();
                if(resultado.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Correo almacenado correctamente.'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'Correo no se ha almacenado'
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Correo Duplicado'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
        }else{
            excepcion.Code = 1
            excepcion.ErrorType = 'DES'
            excepcion.Message = 'No existe Usuario'
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

async function actualizarCorreo(req:Request, res:Response, op: number): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try
    {
        const user:Usuario = new Usuario(req.body.idUser,'',0);
        if((await (user.existeUsuario())).existe){
            const mail:Email = new Email(req.body.idCorreo,'',0,req.body.idUser);
            let validador:ResultadoEjecucion = await mail.existeCorreo();
            // se valida que exista la linea
            if(validador.existe) {
                if(op===1)
                    mail.creationUser = req.body.downUser
                else if(op==3){
                    mail.correo = req.body.correo
                    mail.type = req.body.tipo
                }
                const result = await mail.updateCorreo(op);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Correo actualizado correctamente.'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'Correo no se ha actualizado'
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Correo no existe!'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
        }else{
            excepcion.Code = 1
            excepcion.ErrorType = 'DES'
            excepcion.Message = 'No existe Usuario'
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

export async function updateTelefono(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.idTelefono && req.body.telefono){
        return actualizarTelefono(req,res,3);
    }
    return res
        .status(400)
        .json(excepcion)
}

export async function altaTelefono(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.idTelefono){
        return actualizarTelefono(req,res,2);
    }
    return res
        .status(400)
        .json(excepcion)
}

export async function bajaTelefono(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.idTelefono && req.body.downUser){
        return actualizarTelefono(req,res,1);
    }
    return res
        .status(400)
        .json(excepcion)
}


async function actualizarTelefono(req:Request, res:Response, op: number): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try
    {
        const user:Usuario = new Usuario(req.body.idUser,'',0);
        if((await (user.existeUsuario())).existe){
            const telefono:Telefono = new Telefono(req.body.idTelefono,'',0,req.body.idUser);
            let validador:ResultadoEjecucion = await telefono.existeTelefono();
            // se valida que exista la linea
            if(validador.existe) {
                if(op===1)
                    telefono.creationUser = req.body.downUser
                else if(op==3){
                    telefono.telefono = req.body.telefono
                    telefono.type = req.body.tipo
                }
                const result = await telefono.updateTelefono(op);
                if(result.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Telefono actualizado correctamente.'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'Telefono no se ha actualizado'
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Telefono no existe!'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
        }else{
            excepcion.Code = 1
            excepcion.ErrorType = 'DES'
            excepcion.Message = 'No existe Usuario'
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

export async function guardarNuevoTelefono(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 999,
        ErrorType: 'DES',
        Message: ''
    };
    try
    {

        if(!req.body.idUser || !req.body.telefono || !req.body.tipo || !req.body.userCreate){
            excepcion.ErrorType= 'NEG',
            excepcion.Message= 'Request no Valido!'
            excepcion.Code= 1
            return res
                .status(400)
                .json(excepcion)
        }

        const user:Usuario = new Usuario(req.body.idUser,'',0);
        if((await (user.existeUsuario())).existe){
            const mail:Telefono = new Telefono(0,req.body.telefono,req.body.userCreate,req.body.idUser);
            const result:ResultQuery = await select(`SELECT 1 FROM usuario_telefono where id_user=${user.ID} AND telefono ='${req.body.telefono}'`)
            // se valida que exista la linea
            if(result.result.length === 0) {
                mail.type = req.body.tipo;
                const resultado = await mail.guardarTelefono();
                if(resultado.ejecutado){
                    return res.json({
                        Code: 0,
                        Message: 'Télefono almacenado correctamente.'
                    });
                }
                excepcion.Code = 1
                excepcion.ErrorType = 'DES'
                excepcion.Message = 'Télefono no se ha almacenado'
            } else {
                // se genera excepción de tipo 1
                excepcion.Message = 'Télefono Duplicado'
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
            }
        }else{
            excepcion.Code = 1
            excepcion.ErrorType = 'DES'
            excepcion.Message = 'No existe Usuario'
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

export async function updateUsuario(req:Request, res:Response): Promise<Response> {
    const excepcion:Excepcion = {
        Code: 1,
        ErrorType: 'DES',
        Message: 'Request no Valido!'
    }

    if(req.body.idUser && req.body.primerNombre && req.body.primerApellido && req.body.idRol && req.body.dpi){
        const user:Usuario = new Usuario(req.body.idUser,'',0);
        user.idRol = req.body.idRol;
        if((await (user.existeRol())).existe){
            return await actualizarUsuario(req,res,3)
        }else{
            excepcion.Code = 1
            excepcion.ErrorType = 'DES'
            excepcion.Message = 'No existe Rol'
        }
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
            let validador:ResultadoEjecucion = await user.existeUsuario(false);
            // se valida que exista la linea
            if(validador.existe) {
                if(op===1)
                    user.creationUser = req.body.downUser
                else if(op==3){
                    user.idRol = req.body.idRol;
                    user.primer_apellido = req.body.primerApellido
                    user.primer_nombre = req.body.primerNombre
                    user.segundo_nombre = req.body.segundoNombre
                    user.segundo_apellido = req.body.segundoApellido
                    user.dpi = req.body.dpi;
                }
                    
                const result = await user.updateUsuario(op);
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
        
        if(req.body.primerNombre && req.body.primerApellido && req.body.creationUser && req.body.email && req.body.dpi && req.body.telefono){
            let user: Usuario = new Usuario(0,req.body.email,req.body.creationUser);
            user.idRol = req.body.idRol;
            user.primer_apellido = req.body.primerApellido
            user.primer_nombre = req.body.primerNombre
            user.segundo_nombre = req.body.segundoNombre
            user.segundo_apellido = req.body.segundoApellido
            user.dpi = req.body.dpi;
            
            if((await (user.existeUsername())).existe){
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
                excepcion.Message = 'El Correo ingresado, ya fue utilizado por un usuario previamente'
            }else if(!(await (user.existeRol())).existe){
                excepcion.Code = 1
                excepcion.ErrorType = 'NEG'
                excepcion.Message = 'El Rol ingresado, no existe'
            }else{
                const result = await user.guardarUsuario(req.body.telefono);
                if(result.ejecutado){
                    const password:Password = new Password();
                    password.userID = user.ID;
                    const resultPassword = await password.generarContraseñaTemporal(user.username,user.creationUser);

                    if(resultPassword.ejecutado){
                        return res.json({
                            Code: 0,
                            Message: 'Usuario almacenado correctamente',
                            UserID: password.userID,
                            Username: user.username,
                            Password: resultPassword.error
                        });
                    }else{
                        return res.json({
                            Code: 0,
                            Message: 'Usuario almacenado correctamente',
                            Username: user.username,
                            Password: ''
                        });
                    }
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
                await user.loadMediosContactoUsuario();
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
