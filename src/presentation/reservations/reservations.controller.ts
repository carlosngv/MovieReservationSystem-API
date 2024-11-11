import { Request, Response } from "express";
import Logger from "../../config/logger.config";
import { APIResponse } from "../interfaces/api-response.interface";
import { CreateReservationDTO } from "../../domain/dtos/reservations/create-reservation.dto";
import { handleError } from "../helpers/handleControllerError.helper";
import { ReservationService } from "../services/reservations.service";
import { ReservationEntity } from "../../domain/entities/reservation.entity";

export class ReservationController {

    // todo: ReservationService DI
    constructor(
        private reservationService: ReservationService
    ) {}


    public getReservationById = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.reservationService.getReservationByID( Number( id ) )
            .then( r => {
                const response: APIResponse<any, null> = { data: r, success: true };
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ) );
    }

    public getAllReservations = ( req: Request, res: Response ) => {

        this.reservationService.getAllReservations()
            .then( reservations => {
                const response: APIResponse< ReservationEntity[], undefined > = { data: reservations, success: true };
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ) );
    }

    public createReservation = ( req: Request, res: Response ) => {
        const [ errorMessage, createReservationDTO ] = CreateReservationDTO.create( req.body );
        if( errorMessage ) handleError( res, errorMessage );

        this.reservationService.createReservation( createReservationDTO! )
            .then( r => {
                const response: APIResponse< ReservationEntity, null > = {
                    data: r,
                    success: true,
                }

                res.status(201).json( response );
            })
            .catch( error => handleError( res, error ) );

    }

    public getReservationsByUserId = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.reservationService.getReservationsByUserID( Number(id) )
            .then( reservations => {
                const response: APIResponse< ReservationEntity[], undefined > = { data: reservations, success: true };
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ));
    }

    public getReservationsByMovieId = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.reservationService.getReservationsByMovieID( Number(id) )
            .then( reservations => {
                const response: APIResponse< ReservationEntity[], undefined > = { data: reservations, success: true };
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ));
    }

    public deleteReservationById = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.reservationService.deleteReservationByID( Number(id) )
            .then( r => {
                const response: APIResponse<null, null> = { success: true };
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ) );

    }



}
