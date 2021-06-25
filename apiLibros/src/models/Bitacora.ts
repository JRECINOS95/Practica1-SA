import axios from "axios";
import { URL_BITACORA } from "../utils/config";
import { select } from "../utils/database";

export class Transaccion{
    public idLibro:number;
    public idUser:number;
    public operacion:string;

    constructor(idLibro:number, idUser:number, operacion:string){
        this.idLibro = idLibro;
        this.idUser = idUser;
        this.operacion = operacion;
    }

    async enviarBitacora(): Promise<boolean>
    {

        if(this.idLibro === -1){
            let query=`SELECT MAX(id_libro) as id FROM libro WHERE status !='INACTIVO';`;
            const result = await select(query);
            
            if(result.result.length>0){
                this.idLibro = result.result[0].id;
            }
        }

        try {
            axios.post(URL_BITACORA,{
                idLibro: this.idLibro,
                idUser: this.idUser, 
                operacion: this.operacion
            }).then(()=> {
                return true;
            }).catch(error => {
                console.log('Error in enviarBitacora',error);
            return false;
            })
        } catch (error) {
            console.log('Error in enviarBitacora',error);
            return false;
        }
        return false;
    }
}