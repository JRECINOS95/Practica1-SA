import axios from "axios";
import { URL_BITACORA } from "../utils/config";

export class Transaccion{
    public idLibro:number;
    public idUser:number;
    public operacion:string;

    constructor(idLibro:number, idUser:number, operacion:string){
        this.idLibro = idLibro;
        this.idUser = idUser;
        this.operacion = operacion;
    }

    enviarBitacora():boolean
    {
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