import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../interfaces/api-response.interface";
import { JWTAdapter } from "../../adapters/jwt.adapter";
import { prisma } from "../../data/mysql/mysql.config";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddleware {

    static async verifyJWT( req: Request, res: Response, next: NextFunction ) {

        const response: APIResponse<undefined, string> = { error: '', success: false, } ;

        const authorization = req.header('Authorization');

        if( !authorization ) {
            response.error = 'No token provided';
            res.status(401).json( response );
            return

        }

        if( !authorization?.startsWith('Bearer') ) {
            response.error = 'No token provided';
            res.status(401).json( response );
            return

        }

        const token = authorization?.split(' ')[1];

        if( !token ) {
            response.error = 'No token provided';
            res.status(401).json( response );
            return
        }

        try {

            const payload = await JWTAdapter.verifyToken< { user_id: string, email: string } >( token! );

            if( !payload ) {
                response.error = 'Token is not valid';
                res.status(401).json( response );
                return
            }

            const dbUser = await prisma.user.findUnique({
                where: {
                    email: payload?.email,
                }
            });

            if( !dbUser ) {
                response.error = 'Token is not valid';
                res.status(401).json( response );
                return;
            }

            const { password, ...user } = UserEntity.fromObject( dbUser! );

            req.body.user = user;

            next();


        } catch (error) {
            console.log({ error})
            next( error );
        }



    }

}
