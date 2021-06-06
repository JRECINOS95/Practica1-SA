
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import { select, query } from '../utils/database'

export class Email{
    public ID:number;
    public userID: number;
    public correo:string;
    public type: string;
    public creationDate:Date;
    public creationUser:number;
    public status: string;

    constructor(id:number,correo:string,userCreate:number,userId:number){
        this.ID = id;
        this.userID = userId;
        this.correo = correo;
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

    
    async guardarCorreo(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            const sql = `INSERT INTO usuario_correo(id_user,correo, tipo, creation_user) values (${this.userID},'${this.correo}','${this.type}',${this.creationUser})`
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
            console.log('Error en guardarCorreo',error);
            validador.error = error;
            return validador;
        }
    }

    async updateCorreo(tipo:number):  Promise<ResultadoEjecucion>{
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
                sql = `UPDATE usuario_correo SET down_user = ${this.creationUser}, down_date =now() WHERE id_correo = ${this.ID}`;
            }else if(tipo===2){ // se da de alta
                sql = `UPDATE usuario_correo SET down_user = null, down_date = null WHERE id_correo = ${this.ID}`
            }else if(tipo===3) { //se actualiza nombre
                sql = `UPDATE usuario_correo SET correo = '${this.correo}', tipo = '${this.type}' WHERE id_correo = ${this.ID}`
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
            console.log('Error en updateCorreo',error);
            validador.error = error;
            return validador;
        }
    }  

    async existeCorreo(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            const result = await select(`select * from usuario_correo WHERE id_correo=${this.ID}`);
            if(result.result!==null){
                this.userID = result.result[0].user_id;;
                this.correo = result.result[0].correo;
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
            console.log('Error en existeCorreo',error);
            validador.error = error;
            return validador;
        }
    }


}