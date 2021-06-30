import { ResultadoEjecucion } from "../interface/ResultadoEjecucion";
import { query } from "../utils/database";

export class Tracking{
    public id:number;
    public idTransaccion:number;
    public status: string;

    constructor(id:number, transaccion:number, status:string){
        this.id = id;
        this.idTransaccion = transaccion;
        this.status = status;
    }

    async updateStatus(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            let sql = `UPDATE medio_envio SET status='${this.status}' WHERE id_medio_envio = ${this.id};`;
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
            console.log('Error en updateStatus',error);
            validador.error = error;
            return validador;
        }
    }


}