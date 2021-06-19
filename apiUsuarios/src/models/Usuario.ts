'use strict';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import {query, select} from '../utils/database';

export class Usuario{
    public id:number;
    public primer_nombre:string;
    public segundo_nombre:string;
    public primer_apellido:string;
    public segundo_apellido:string;
    public status:string;
    public rol: string;
    public username: string;
    public telefono: string;
    public direccion: string;
    public validado: boolean;
    public password: string;

    constructor(id:number,email:string,userCreate:number){
        this.id = id;
        this.primer_nombre = '';
        this.segundo_nombre = '';
        this.primer_apellido = '';
        this.segundo_apellido = '';
        this.status = 'ACTIVO';
        this.rol = '';
        this.username = email;
        this.telefono = '';
        this.direccion = '';
        this.validado = false;
        this.password = '';
    }


    async existeUsername(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            const result = await select(`SELECT 1 FROM usuario WHERE username ='${this.username}';`);
            if(result.result.length>0){
                validador.existe = true;
                return validador;
            }else{
                validador.existe = false;
                return validador;
            }
        } catch (error) {
            console.log('Error en existeUsername',error);
            validador.error = error;
            return validador;
        }
    }
    
    async updateUsuario(tipo:number,password:string):  Promise<ResultadoEjecucion>{
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
                sql = `UPDATE usuario SET status = 'INACTIVO' WHERE id_user = ${this.id};`
            }else if(tipo===2){ // se da de alta
                sql = `UPDATE usuario SET status = 'ACTIVO' WHERE id_user = ${this.id};`
            }else if(tipo===3) { //se actualizan los campos
                sql = `UPDATE usuario SET primer_nombre = '${this.primer_nombre}', segundo_nombre = '${this.segundo_nombre}', primer_apellido = '${this.primer_apellido}', `
                sql += `segundo_apellido = '${this.segundo_apellido}', username='${this.username}', password='${password}', rol= '${this.rol}', telefono='${this.telefono}', direccion='${this.direccion}' WHERE id_user = ${this.id};`;
            }else if(tipo===4){ // se da de alta
                sql = `UPDATE usuario SET validado = 1, status = 'ACTIVO' WHERE id_user = ${this.id};`
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
            console.log('Error en updateUsuario',error);
            validador.error = error;
            return validador;
        }
    }  

    async guardarUsuario(password:string): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let valido = 1;
            if(this.rol==='EDITORIAL'){
                valido = 0;
                this.status = 'PENDIENTE';
            }
                

            let sql = `INSERT INTO usuario(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rol, username, password, telefono, direccion,validado,status)  `;
            sql += ` values ('${this.primer_nombre}','${this.segundo_nombre}','${this.primer_apellido}','${this.segundo_apellido}','${this.rol}','${this.username}','${password}','${this.telefono}','${this.direccion}',${valido}, '${this.status}' ) ;`;
            const result = await query(sql);
            if(result.result!==null){
                if(result.result.affectedRows>0){
                    validador.ejecutado = true;
                    this.id = result.result.insertId;
                }
                return validador;
            }else{
                validador.ejecutado = false;
                validador.error = result.errorDescription;
                return validador;
            }
            return validador;
        } catch (error) {
            console.log('Error en guardarUsuario',error);
            validador.error = error;
            return validador;
        }
    }

    async existeUsuario(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            let query=`SELECT * FROM usuario WHERE id_user =${this.id} AND status !='INACTIVO';`;
            const result = await select(query);
            
            if(result.result.length>0){
                this.primer_nombre = result.result[0].primer_nombre;
                this.segundo_nombre = result.result[0].segundo_nombre;
                this.primer_apellido = result.result[0].primer_apellido;
                this.segundo_apellido = result.result[0].segundo_apellido;
                this.status = result.result[0].status;
                this.rol = result.result[0].rol;
                this.username = result.result[0].username;
                this.telefono = result.result[0].telefono;
                this.direccion = result.result[0].direccion;
                this.validado = result.result[0].validado;
                this.password = result.result[0].password;
                validador.existe = true;
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

}