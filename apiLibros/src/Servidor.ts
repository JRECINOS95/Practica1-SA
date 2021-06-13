import express, { Application } from 'express';
import morgan from 'morgan';
import routesIndex from './routes/index.routes';
import {PORT} from './utils/config'
import routesLibros from './routes/libros.routes';
import { Server } from 'http';
import cors from 'cors';

export class Servidor {

    public app: Application;
    public server: Server;

    private options: cors.CorsOptions = {
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'X-Access-Token',
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: "*",
        preflightContinue: false,
      };

    constructor(private port?: number | string){
        this.app = express();
        this.app.use(cors(this.options))
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
        this.app.use('/libro',routesLibros);
    }

    async listen(){
        this.server = this.app.listen(this.app.get('port'));
        console.log('Server on port ',this.app.get('port'));
    }
    
}