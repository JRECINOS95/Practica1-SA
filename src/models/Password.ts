
import { ResultadoEjecucion } from '../interface/ResultadoEjecucion';
import { ResultQuery } from '../interface/ResultQuery';
import { select, query } from '../utils/database'
import { getRandomPassword, encryptUsingAES256, decryptUsingAES256 } from '../utils/encrip'

export class Password{
    public userID: number;
    public password:string;
    public passwordTemporary: boolean;
    public status:string;
    public creationDate:Date;
    public creationUser:number;
    
    constructor(){
        this.userID = 0;
        this.password = '';
        this.passwordTemporary = false;
        this.creationDate = new Date();
        this.creationUser = 0;
        this.status = '';
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

    
    async generarContraseñaTemporal(username:string, userCreate:number): Promise<ResultadoEjecucion>{
        let validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            if(this.userID === 0){
                const resultado = await this.loadUserId(username);
                if(!resultado.existe){
                    validador.ejecutado = false;
                    validador.error = "No se ha podido cargar el id del Usuario!";
                    return validador;
                }
            }
            
            //SE DAN DE BAJA LAS CONTRASEÑAS ANTERIORES
            const update = `UPDATE usuario_password SET status = 'INACTIVO', down_date = NOW(), down_user = 1 WHERE status ='ACTIVO' AND id_user=${this.userID}`;
            const update_result = await query(update); 
            if(update_result.result!==null){
                //SE GENERA LA NUEVA CONTRASEÑA
                const password = getRandomPassword();
                this.password = encryptUsingAES256(password);
                this.passwordTemporary = true;
                this.creationUser = userCreate;
                validador = await this.guardarContraseña();
                if(validador.ejecutado){
                    validador.error = password
                }
                return validador;
            }else{
                validador.ejecutado = false;
                validador.error = update_result.errorDescription;
                return validador;
            }
        } catch (error) {
            console.log('Error en generarContraseñaTemporal',error);
            validador.error = error;
            return validador;
        }
    }

    
    async validarContraseña(username:string, password:string): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        
        try {
            if(this.userID === 0){
                const resultado = await this.loadUserId(username);
                if(!resultado.existe){
                    validador.ejecutado = false;
                    validador.error = "Usuario Incorrecto";
                    return validador;
                }
            }
            password = encryptUsingAES256(password);
            const result = await select(`SELECT * FROM usuario_password WHERE id_user=${this.userID} AND password = '${password}' AND status='ACTIVO'`);
            if(result.result!==null){
                this.userID = result.result[0].id_user;
                this.password = decryptUsingAES256(result.result[0].password);
                this.passwordTemporary = result.result[0].password_temporary;
                this.creationDate = result.result[0].creation_date;
                this.creationUser = result.result[0].creation_user;
                this.status = result.result[0].status;
                validador.existe = true;
                return validador;
            }else{
                validador.existe = false;
                return validador;
            }
        } catch (error) {
            console.log('Error en validarContraseña',error);
            validador.error = error;
            return validador;
        }
    }

    async cambiarContraseña(username:string, passwordOld:string, passwordNew:string): Promise<ResultadoEjecucion>{
        let validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        try {
            if(this.userID === 0){
                const resultado = await this.loadUserId(username);
                if(!resultado.existe){
                    validador.ejecutado = false;
                    validador.error = "Usuario Incorrecto";
                    return validador;
                }
            }
            
            if(!(await (await this.validarContraseña(username, passwordOld)).existe)){
                validador.ejecutado = false;
                    validador.error = "Contraseña Incorrecta";
                    return validador;
            }
            
            //SE DAN DE BAJA LAS CONTRASEÑAS ANTERIORES
            const update = `UPDATE usuario_password SET status = 'INACTIVO', down_date = NOW(), down_user = 1 WHERE status ='ACTIVO' AND id_user=${this.userID}`;
            const update_result = await query(update); 
            if(update_result.result!==null){
                this.password = encryptUsingAES256(passwordNew);
                this.creationUser = 1;
                this.passwordTemporary = false;
                validador = await this.guardarContraseña();
                return validador;
            }else{
                validador.ejecutado = false;
                validador.error = update_result.errorDescription;
                return validador;
            }
        } catch (error) {
            console.log('Error en generarContraseñaTemporal',error);
            validador.error = error;
            return validador;
        }
    }

    async guardarContraseña(): Promise<ResultadoEjecucion>{
        const validador:ResultadoEjecucion = {
            error: null,
            existe: false
        }
        const sql = `INSERT INTO usuario_password(id_user,password, password_temporary, creation_user) values (${this.userID},'${this.password}',${Number(this.passwordTemporary)},${this.creationUser});`;
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
    }

}