import express, { Application } from 'express';
import morgan from 'morgan';
import routesIndex from './routes/index.routes';
import {PORT} from './utils/config'
import routesLibros from './routes/libros.routes';
import routesSolicitudes from './routes/solicitudes.routes';
import { Server } from 'http';
import cors from 'cors';
var bodyParser = require('body-parser');

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
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
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
        this.app.use('/solicitud',routesSolicitudes);
    }

    async listen(){
        this.server = this.app.listen(this.app.get('port'));
        console.log('Server on port ',this.app.get('port'));
    }
    
}