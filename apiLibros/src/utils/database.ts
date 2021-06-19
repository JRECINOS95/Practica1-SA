import { createPool } from 'mysql2/promise';
import {SERVER_DB, DB_DEFAULT, DB_PASS, DB_PORT, DB_USER} from './config';
import { ResultQuery } from '../interface/ResultQuery'

async function connect() {
    const connection = await createPool({
        host: SERVER_DB,
        user: DB_USER,
        password: DB_PASS,
        database: DB_DEFAULT,
        port: +DB_PORT,
        connectionLimit: 10,
        typeCast: function castField( field, useDefaultTypeCasting ) {

            // We only want to cast bit fields that have a single-bit in them. If the field
            // has more than one bit, then we cannot assume it is supposed to be a Boolean.
            if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
    
                var bytes = field.buffer();
    
                // A Buffer in Node represents a collection of 8-bit unsigned integers.
                // Therefore, our single "bit field" comes back as the bits '0000 0001',
                // which is equivalent to the number 1.
                return( bytes[ 0 ] === 1 );
    
            }
    
            return( useDefaultTypeCasting() );
    
        }
    });
    return connection;
}


export async function select(query:string): Promise<ResultQuery>{
    const conn = await connect();
    const result:ResultQuery ={
        result: null,
        errorDescription: '',
        execute: false
    }
    try{
        const resultSelect = await conn.query(query);
        conn.end();
        result.execute = true
        result.result = resultSelect[0]
        return result;
    }catch(error){
        console.log('Error in select',error);
        conn.end();
        result.errorDescription = error;
        return result;
    }
}

export async function query(query:string): Promise<ResultQuery>{
    const result:ResultQuery ={
        result: null,
        errorDescription: '',
        execute: false
    }
    const conn = await connect();
    try{
        const execResult = await conn.query(query);
        conn.end();
        result.execute = true
        result.result = execResult[0]
        return result;
    }catch(error){
        console.log('Error in insert',error);
        result.errorDescription = error;
        return result;
    }
}
