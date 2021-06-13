'use strict';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import {query, select} from '../utils/database';
import { Genero } from './Genero';

export class Libro{
    public id:number;
    public nombre:string;
    public autor:string;
    public url:string;
    public stock:number;
    public status:string;
    public idUser:number;
    public generos:Array<Genero>;
    constructor(id:number,nombre:string){
        this.id = id;
        this.nombre = nombre;
        this.url = '';
        this.autor = '';
        this.status = 'ACTIVO';
        this.stock = 0;
        this.idUser = 0;
        this.generos = new Array<Genero>();
    }

    async saveGeneros(idLibro:number): Promise<Boolean> {
        await query(`DELETE from  libro_genero WHERE id_libro = ${idLibro};`);
        for (const element of this.generos){
            await query(`INSERT INTO libro_genero(id_libro,id_genero) VALUES(${idLibro},${element.id});`);
        }
        return true;
    }

    async updateLibro(tipo:number):  Promise<ResultadoEjecucion>{
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
                sql = `UPDATE libro SET status = 'INACTIVO' WHERE id_libro = ${this.id};`
            }else if(tipo===2){ // se da de alta
                sql = `UPDATE libro SET status = 'ACTIVO' WHERE id_libro = ${this.id};`
            }else if(tipo===3) { //se actualizan los campos
                sql = `UPDATE libro SET nombre = '${this.nombre}', autor = '${this.autor}', url = '${this.url}', stock = ${this.stock} WHERE id_libro = ${this.id};`;
            }

            result = await query(sql);
            if(tipo===3){
                this.saveGeneros(this.id);
            }
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

    async guadarLibro(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let sql = `INSERT INTO libro(nombre, url, id_user, stock, autor) `;
            sql += ` values ('${this.nombre}','${this.url}',${this.idUser}, ${this.stock}, '${this.autor}') ;`;
            const result = await query(sql);
            if(result.result!==null){
                if(result.result.affectedRows>0){
                    await this.saveGeneros(result.result.insertId);
                    validador.ejecutado = true;
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

    async existeLibro(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }

        try {
            let query=`SELECT * FROM libro WHERE id_libro =${this.id} AND status !='INACTIVO';`;
            const result = await select(query);
            
            if(result.result.length>0){
                this.nombre = result.result[0].nombre;
                this.url = result.result[0].url;
                this.idUser = result.result[0].id_user;
                this.stock = result.result[0].stock;
                this.status = result.result[0].status;
                this.autor = result.result[0].autor;

                const rGeneros = await select(`SELECT id_genero FROM libro_genero where id_libro = ${this.id};`);
                const lista:Array<Genero> = new Array<Genero>();
                if(result.execute){
                    for (let element of rGeneros.result){
                        const rGenero = await select(`SELECT nombre FROM genero_literario where id_genero = ${element.id_genero};`);
                        const genero:Genero = new Genero(element.id_genero,rGenero.result[0].nombre);
                        lista.push(genero);
                    }
                    this.generos = lista;
                }
                validador.existe = true;
                return validador;
            }else{
                validador.existe = false;
                return validador;
            }
        } catch (error) {
            console.log('Error en existeLibro',error);
            validador.error = error;
            return validador;
        }
    }

}