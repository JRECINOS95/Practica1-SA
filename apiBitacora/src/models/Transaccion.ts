'use strict';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import {query, select} from '../utils/database';

export class Transaccion{
    public id:number;
    public idLibro:number;
    public idUser:number;
    public operacion:string;
    public fechaOperacion: string;

    constructor(id:number,idLibro:number, idUser:number, operacion:string){
        this.id = id;
        this.idLibro = idLibro;
        this.idUser = idUser;
        this.operacion = operacion;
        this.fechaOperacion = '';
    }

    async guardarTransaccion(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let sql = `INSERT INTO bitacora_libro(id_libro, id_user, operacion) `;
            sql += ` values (${this.idLibro},${this.idUser},'${this.operacion}') ;`;
            const result = await query(sql);
            if(result.result!==null){
                validador.ejecutado = true;
                return validador;
            }else{
                validador.ejecutado = false;
                validador.error = result.errorDescription;
                return validador;
            }
            return validador;
        } catch (error) {
            console.log('Error en guardarTransaccion',error);
            validador.error = error;
            return validador;
        }
    }
}