'use strict';
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import {query, select} from '../utils/database';

export class Transaccion{
    public id:number;
    public idLibro:number;
    public idUser:number;
    public cantidad:number;
    public valorUnitario:number;
    public valorImpuestos:number;
    public valorFinal:number;
    public tipoPago:string;
    public tarjeta:string;
    public cvv:string;

    constructor(id:number,idLibro:number, idUse:number){
        this.id = id;
        this.idLibro = idLibro;
        this.idUser = idUse;
        this.cantidad = 0;
        this.valorUnitario = 0;
        this.valorImpuestos = 0;
        this.valorFinal = 0;
        this.tipoPago = '';
        this.tarjeta = '';
        this.cvv = '';
    }


    async guardarTransaccion(direccion:string): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let sql = `INSERT INTO transaccion(id_libro, id_user, cantidad, valor_unitario, valor_impuestos, valor_final, tipo_pago, numero_tarjeta, cvv_tarjeta) `;
            sql += ` values (${this.idLibro},${this.idUser},${this.cantidad}, ${this.valorUnitario}, '${this.valorImpuestos}', ${this.valorFinal}, '${this.tipoPago}','${this.tarjeta}','${this.cvv}') ;`;
            const result = await query(sql);
            if(result.result!==null){
                if(result.result.affectedRows>0){
                    await query(`update libro set stock = stock - ${this.cantidad} where id_libro = ${this.idLibro};`)
                    await query(`insert into medio_envio(id_transaccion,direccion) values(${result.result.insertId},'${direccion}');`)
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
            console.log('Error en guardarTransaccion',error);
            validador.error = error;
            return validador;
        }
    }
}