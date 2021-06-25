'use strict';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import {query, select} from '../utils/database';
import fs from 'fs';
import { Transaccion } from './Bitacora';
const { exec } = require('child_process');


export class SolicitudLibro{
    public id:number;
    public nombre:string;
    public autor:string;
    public fechaPublicacion:string;
    public file:any;
    public status:string;
    public idUser:number;
    public idEditorial: number;
    public fechaAceptacion:string;
    public urlDownload:string;

    constructor(id:number,nombre:string){
        this.id = id;
        this.nombre = nombre;
        this.autor = '';
        this.status = 'ACTIVO';
        this.fechaPublicacion = '';
        this.idUser = 0;
        this.idEditorial = 0;
        this.fechaAceptacion = '';
        this.urlDownload = '';
    }


    async updateSolicitudLibro(tipo:number):  Promise<ResultadoEjecucion>{
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
                sql = `UPDATE solicitud_libro SET status = 'INACTIVO' WHERE solicitud_libro = ${this.id};`
            }else if(tipo===2){ // se da de alta
                sql = `UPDATE solicitud_libro SET status = 'ACTIVO' WHERE solicitud_libro = ${this.id};`
            }else if(tipo===3) { //se confirma la solicitud
                const bitacora: Transaccion = new Transaccion(-1,this.idEditorial,'ACEPTA SOLICITUD');
                bitacora.enviarBitacora();
                sql = `UPDATE solicitud_libro SET status = 'ATENDIDO', fecha_aceptacion = now(), id_editorial = ${this.idEditorial}  WHERE solicitud_libro = ${this.id};`;
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
            console.log('Error en updateSolicitudLibro',error);
            validador.error = error;
            return validador;
        }
    }  

    async guadarSolicitudLibro(data:string): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {

            let nombreArchivo = '';
            if(this.file!==''){
                nombreArchivo = this.file;
                await fs.writeFileSync('/tmp/archivos_libros_sa/'+nombreArchivo, data,{encoding: 'base64'});
                await exec(`gsutil cp /tmp/archivos_libros_sa/${nombreArchivo} gs://bucke-sa/libros_sa`, (error: { message: any; }, stdout: any, stderr: any) => {
                    if (error) {
                      console.error(`error: ${error.message}`);
                      return;
                    }
                  
                    if (stderr) {
                      console.error(`stderr: ${stderr}`);
                      return;
                    }
                  
                    console.log(`stdout:\n${stdout}`);
                  });
            }
            let sql = `INSERT INTO solicitud_libro(nombre, autor, fec_primera_publicacion, nombre_archivo, id_cliente) `;
            sql += ` values ('${this.nombre}','${this.autor}','${this.fechaPublicacion}', '${nombreArchivo}', ${this.idUser}) ;`;
            const result = await query(sql);
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
            console.log('Error en guadarSolicitudLibro',error);
            validador.error = error;
            return validador;
        }
    }

    async existeSolicitudLibro(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            let query=`SELECT * FROM solicitud_libro WHERE solicitud_libro =${this.id} AND status='ACTIVO';`;
            const result = await select(query);
            
            if(result.result.length>0){
                this.nombre = result.result[0].nombre;
                this.autor = result.result[0].autor;
                this.fechaPublicacion = result.result[0].fec_primera_publicacion;
                this.file = result.result[0].nombre_archivo;
                this.urlDownload = `https://storage.googleapis.com/bucke-sa/libros_sa/${this.file}`;
                this.status = result.result[0].status;
                this.idUser = result.result[0].id_cliente;
                this.idEditorial = result.result[0].id_editorial;
                this.fechaAceptacion = result.result[0].fecha_aceptacion;
                validador.existe = true;
                return validador;
            }else{
                validador.existe = false;
                return validador;
            }
        } catch (error) {
            console.log('Error en existeSolicitudLibro',error);
            validador.error = error;
            return validador;
        }
    }
}