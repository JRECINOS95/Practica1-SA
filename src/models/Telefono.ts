
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import { select, query } from '../utils/database'

export class Telefono{
    public ID:number;
    public userID: number;
    public telefono:string;
    public type: string;
    public creationDate:Date;
    public creationUser:number;
    public status: string;

    constructor(id:number,telefono:string,userCreate:number,userId:number){
        this.ID = id;
        this.userID = userId;
        this.telefono = telefono;
        this.type = 'PRINCIPAL';
        this.status = 'ACTIVO';
        this.creationDate = new Date();
        this.creationUser = userCreate;
    }

    async loadUserId(username:string): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            const result = await select(`SELECT id_user FROM usuario WHERE username = '${username}' AND down_date is null;`);
            if(result.result!==null){
                validador.existe = true;
                this.userID = result.result[0].id_user;
                return validador;
            }else{
                validador.existe = false;
                return validador;
            }
        } catch (error) {
            console.log('Error en existeUsuario',error);
            validador.error = error;
            return validador;
        }
    } 

    
    async guardarTelefono(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {

            const sql = `INSERT INTO usuario_telefono(id_user,telefono, tipo, creation_user) values (${this.userID},'${this.telefono}','${this.type}',${this.creationUser})`
            const result = await query(sql);
            if(result.result!==null){
                if(result.result.affectedRows>0){
                    validador.ejecutado = true;
                    this.ID = result.result.insertId;
                }
                return validador;
            }else{
                validador.ejecutado = false;
                validador.error = result.errorDescription;
                return validador;
            }
            return validador;
        } catch (error) {
            console.log('Error en guardarTelefono',error);
            validador.error = error;
            return validador;
        }
    }

    async updateTelefono(tipo:number):  Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let sql = '';
            let result:ResultQuery = {
                result: null,
                errorDescription: '',
                execute: false

            }

            if(tipo===1){ // se da de baja
                sql = `UPDATE usuario_telefono SET down_user = ${this.creationUser}, down_date =now() WHERE id_telefono = ${this.ID}`;
            }else if(tipo===2){ // se da de alta
                sql = `UPDATE usuario_telefono SET down_user = null, down_date = null WHERE id_telefono = ${this.ID}`
            }else if(tipo===3) { //se actualiza nombre
                sql = `UPDATE usuario_telefono SET telefono = '${this.telefono}', tipo = '${this.type}' WHERE id_telefono = ${this.ID}`
            }
            result = await query(sql);

            if(result.result!==null){
                if(result.result.affectedRows>0){
                    validador.ejecutado = true;
                }
                return validador;
            }else{
                validador.ejecutado = false;
                validador.error = result.errorDescription;
                return validador;
            }
        } catch (error) {
            console.log('Error en updateTelefono',error);
            validador.error = error;
            return validador;
        }
    }  

    async existeTelefono(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            const result = await select(`select * from usuario_telefono WHERE id_telefono=${this.ID}`);
            if(result.result!==null){
                this.userID = result.result[0].user_id;;
                this.telefono = result.result[0].telefono;
                this.type = result.result[0].tipo;
                this.status = result.result[0].status;
                this.creationDate = result.result[0].creation_date;
                this.creationUser = result.result[0].creation_user;
                validador.existe = true;
                return validador;
            }else{
                validador.existe = false;
                return validador;
            }
        } catch (error) {
            console.log('Error en exiteTelefono',error);
            validador.error = error;
            return validador;
        }
    }


}