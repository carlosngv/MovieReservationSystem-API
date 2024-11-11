import { NextFunction, Response } from "express";
import Logger from "../../config/logger.config";
import { CustomError } from "../../domain/errors/custom-errors";
import { APIResponse } from "../interfaces/api-response.interface";

export const handleError = ( res: Response, error: any ) => {
    Logger.error(`${ JSON.stringify( error ) }.`);
    if( error instanceof CustomError ) {
        const response: APIResponse< undefined, string > = {
            error: error.message,
            success: false,
        }
        res.status(error.statusCode).json( response );
        return;
    }
    const response: APIResponse< undefined, string > = {
        error,
        success: false,
    }
    res.status(400).json( response );

}
