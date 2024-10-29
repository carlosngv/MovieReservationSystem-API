import express, { Router } from 'express';
import compression from 'compression';

interface Options {
    port: number;
    routes: Router;
}

export class Server {

    private readonly port: number;
    private readonly routes: Router;
    private app = express();

    constructor( options: Options ) {
        this.port = options.port;
        this.routes = options.routes;
    }


    async start() {
        // ? Middlewares
        this.app.use( express.json() );
        this.app.use( compression() );

        // ? Routes
        this.app.use('/api', this.routes)

        this.app.listen( this.port, () => {
            console.log( `Listening on port ${ this.port }` );
        })
    }

}
