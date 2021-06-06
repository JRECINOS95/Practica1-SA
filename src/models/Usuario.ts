'use strict';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import {query, select} from '../utils/database';
import { Email } from './Email';
import { Telefono } from './Telefono';

export class Usuario{
    public ID:number;
    public primer_nombre:string;
    public segundo_nombre:string;
    public primer_apellido:string;
    public segundo_apellido:string;
    public status:string;
    public idRol: number;
    public dpi: string;
    public username: string;
    public creationDate:Date;
    public creationUser:number;
    public telefonos: Array<Telefono>;
    public emails: Array<Email>;

    constructor(id:number,email:string,userCreate:number){
        this.ID = id;
        this.primer_nombre = '';
        this.segundo_nombre = '';
        this.primer_apellido = '';
        this.segundo_apellido = '';
        this.status = 'ACTIVO';
        this.idRol = 0;
        this.dpi = '';
        this.username = email;
        this.creationDate = new Date();
        this.creationUser = userCreate;
        this.telefonos = new Array<Telefono>();
        this.emails = new Array<Email>();
    }

    /// FUNCIÓN QUE VALIDA LA EXISTENCIA DEL ROL QUE SE LE ASIGNA AL USUARIO
    async existeRol(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            const result = await select(`SELECT 1 FROM rol WHERE id_rol =${this.idRol};`);
            if(result.result.length>0){
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

    /// FUNCIÓN QUE VALIDA LA EXISTENCIA DEL USERNAME EN OTRO USUARIO
    async existeUsername(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            const result = await select(`SELECT 1 FROM usuario WHERE username ='${this.username}' AND down_date is null;`);
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
    
    /// FUNCIÓN QUE ACTUALIZA EL USUARIO
    async updateUsuario(tipo:number):  Promise<ResultadoEjecucion>{
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
                sql = `UPDATE usuario SET down_user = ${this.creationUser}, down_date = NOW() WHERE id_user = ${this.ID};`
            }else if(tipo===2){ // se da de alta
                sql = `UPDATE usuario SET down_user = null, down_date = null WHERE id_user = ${this.ID};`
            }else if(tipo===3) { //se actualizan los campos
                sql = `UPDATE usuario SET primer_nombre = '${this.primer_nombre}', segundo_nombre = '${this.segundo_nombre}', primer_apellido = '${this.primer_apellido}', `
                sql += `segundo_apellido = '${this.segundo_apellido}', status= '${this.status}', id_rol= ${this.idRol}, dpi='${this.dpi}' WHERE id_user = ${this.ID};`;
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

    async guardarUsuario(telefono:string): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let sql = `INSERT INTO usuario(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, status, id_rol, dpi, username, creation_user) `;
            sql += ` values ('${this.primer_nombre}','${this.segundo_nombre}','${this.primer_apellido}','${this.segundo_apellido}','${this.status}',${this.idRol},'${this.dpi}','${this.username}',${this.creationUser}) ;`;
            const result = await query(sql);
            if(result.result!==null){
                if(result.result.affectedRows>0){
                    validador.ejecutado = true;
                    this.ID = result.result.insertId;
                    const mail:Email = new Email(0,this.username,this.creationUser,this.ID);
                    const tel:Telefono = new Telefono(0,telefono,this.creationUser,this.ID);

                    await mail.guardarCorreo();
                    await tel.guardarTelefono();
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

    async existeUsuario(filtro:Boolean=true): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            let query=`SELECT * FROM usuario WHERE id_user =${this.ID}`;
            
            if(filtro)
                query+=' AND down_date is null;';
            else
                query+=';';
                const result = await select(query);
            
            if(result.result.length>0){
                this.idRol = result.result[0].id_rol;
                this.primer_apellido = result.result[0].primer_apellido;
                this.primer_nombre = result.result[0].primer_nombre;
                this.segundo_apellido = result.result[0].segundo_apellido;
                this.segundo_nombre = result.result[0].segundo_nombre;
                this.status = result.result[0].status;
                this.username = result.result[0].username;
                this.dpi = result.result[0].dpi;
                this.creationDate = result.result[0].creation_date;
                this.creationUser = result.result[0].creation_user;
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

    async loadMediosContactoUsuario() : Promise<true>{
        //se cargan los telefonos
        this.telefonos = new Array<Telefono>();
        const resulTelefonos = await select(`select id_telefono from usuario_telefono WHERE id_user =${this.ID} AND down_date is null;`);
        if(resulTelefonos.execute){
            for (let element of resulTelefonos.result){
                const tel:Telefono = new Telefono(element.id_telefono,'',0,0);
                await tel.existeTelefono();
                this.telefonos.push(tel);
            }
        }

        //se cargan los correos
        this.emails = new Array<Email>();
        const resulMails = await select(`select id_correo from usuario_correo WHERE id_user =${this.ID} AND down_date is null;`);
        if(resulMails.execute){
            for (let element of resulMails.result){
                const mail:Email = new Email(element.id_correo,'',0,0);
                await mail.existeCorreo();
                this.emails.push(mail);
            }
        }

        return true;
    }
}