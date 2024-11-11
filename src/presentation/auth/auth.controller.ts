import { Request, Response } from "express";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { APIResponse } from "../interfaces/api-response.interface";
import { CreateUserDTO } from "../../domain/dtos/auth/create-user.dto";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../domain/entities/user.entity";
import Logger from "../../config/logger.config";
import { handleError } from "../helpers/handleControllerError.helper";

export class AuthController {

    // TODO: DI
    constructor(
        private authService: AuthService,
    ) { }

    public login = ( req: Request, res: Response ) => {
        const [ errorMessage, loginUserDto ] = LoginUserDTO.create( req.body );

        if( errorMessage ) {
            handleError( res, errorMessage );
            return;
        }

        Logger.info(`LoginUserDTO: ${ JSON.stringify( loginUserDto ) }.`);
        this.authService.loginUser( loginUserDto! )
            .then( user => {
                const response: APIResponse<UserEntity, undefined> = {
                    data: user!,
                    error: undefined,
                    success: true,
                }

                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ) );
    }

    public registerUser = ( req: Request, res: Response ) => {
        const [ errorMessage, createUserDto ] = CreateUserDTO.create( req.body );
        if( errorMessage ) {
            handleError( res, errorMessage );
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
            .catch( error => handleError( res, error ) );


    }

    public renewToken = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'renewToken' })
    }


}
