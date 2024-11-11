import express, { Router } from 'express';
import compression from 'compression';

import { NextFunction, Request, Response } from "express"
import { CustomError } from "../domain/errors/custom-errors";
import { APIResponse } from "./interfaces/api-response.interface";

import swaggerUI from 'swagger-ui-express';
import { specs }  from '../swagger/swagger';

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

        // ? Swagger middleware
        this.app.use( '/api-docs', swaggerUI.serve, swaggerUI.setup( specs ) );

        // ? Routes
        this.app.use('/api', this.routes);

         // ? Routes global error handler
        this.app.use( (err: Error, req: Request, res: Response, next: NextFunction) => {
            let response: APIResponse<undefined, string> = { error: err.message, success: false, } ;
            if( err instanceof CustomError ){
                response.error = err.message;
                res.status( err.statusCode ).json( response );
                return
            }
            console.log(`Routes error: ${ err }`);
            response.error = 'Internal server error';
            res.status( 500 ).json( response );
        } );

        this.app.listen( this.port, () => {
            console.log( `Listening on port ${ this.port }` );
        })
    }

}
