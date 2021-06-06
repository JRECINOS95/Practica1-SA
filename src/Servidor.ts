import express, { Application } from 'express';
import morgan from 'morgan';
import routesIndex from './routes/index.routes';
import {PORT} from './utils/config'
import routeUser from './routes/usuario.routes';
import routeAuth from './routes/auth.routes';
import { Server } from 'http';

export class Servidor {

    public app: Application;
    public server: Server;

    constructor(private port?: number | string){
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
        this.server = new Server();
    }

    settings(){
        this.app.set('port',this.port || PORT || 3000);
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    routes(){
        this.app.use(routesIndex);
        this.app.use('/usuario',routeUser);
        this.app.use('/auth',routeAuth);
    }

    async listen(){
        this.server = this.app.listen(this.app.get('port'));
        console.log('Server on port ',this.app.get('port'));
    }
    
}