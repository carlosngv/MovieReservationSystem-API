import jwt from 'jsonwebtoken';
import { envs } from '../config/envs';
import Logger from '../config/logger.config';

export class JWTAdapter {

    static signToken( payload: any, duration: string = '2h' ): Promise<string | null> {
        return new Promise( ( resolve, reject ) => {
            jwt.sign( payload, envs.JWT_SEED, { expiresIn: duration }, ( error, token ) => {
                if( error ) {
                    Logger.info(`Token wasn't created`);
                    reject( null );
                }
                Logger.info(`Token created - ${ JSON.stringify( { token } ) }`);
                resolve( token! );
            });
        });
    }

    static verifyToken( token: string ): Promise<boolean> {
        return new Promise( ( resolve, reject ) => {
            jwt.verify( token, envs.JWT_SEED, ( error, decoded ) => {
                if( error ) {
                    Logger.error('Token is not valid.');
                    reject( false );
                }
                Logger.info(`Token verified - ${ JSON.stringify( { decoded } ) }`);
                resolve( true );
            });
        });
    }

}
