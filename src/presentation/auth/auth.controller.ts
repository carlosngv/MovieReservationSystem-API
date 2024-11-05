import { Request, Response } from "express";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { APIResponse } from "../interfaces/api-response.interface";
import { CreateUserDTO } from "../../domain/dtos/auth/create-user.dto";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../domain/entities/user.entity";
import Logger from "../../config/logger.config";

export class AuthController {

    // TODO: DI
    constructor(
        private authService: AuthService,
    ) {

    }

    handleError = ( res: Response, error: any ) => {
        if( error instanceof CustomError ) {
            const response: APIResponse< undefined, CustomError > = {
                error,
                success: false,
            }
            res.status(400).json( response );
            return;
        }
        const response: APIResponse< undefined, string > = {
            error,
            success: false,
        }
        res.status(400).json( response );

    }

    public login = ( req: Request, res: Response ) => {
        const [ errorMessage, loginUserDto ] = LoginUserDTO.create( req.body );
        if( errorMessage ) this.handleError( res, errorMessage );

        // TODO: service
    }

    public registerUser = ( req: Request, res: Response ) => {
        const [ errorMessage, createUserDto ] = CreateUserDTO.create( req.body );
        if( errorMessage ) {
            this.handleError( res, errorMessage );
            return;
        }

        Logger.info(`CreateUserDTO: ${ JSON.stringify( createUserDto ) }.`);

        this.authService.createUser( createUserDto! )
            .then( user => {
                const response: APIResponse<UserEntity, undefined> = {
                    data: user! || {},
                    error: undefined,
                    success: true,
                }

                res.status(201).json( response );
            } )
            .catch( error => this.handleError( res, error ) );


    }

    public renewToken = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'renewToken' })
    }


}
