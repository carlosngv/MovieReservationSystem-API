import { Router } from "express";
import { ReservationController } from "./reservations.controller";
import { ReservationService } from "../services/reservations.service";

export class ReservationRoutes {

    static get routes() {
        const router = Router();
        const controller = new ReservationController( new ReservationService() );
        router.get('/',  controller.getAllReservations );
        router.post('/',  controller.createReservation );
        router.get('/users/:id',  controller.getReservationsByUserId );
        router.get('/movies/:id',  controller.getReservationsByMovieId );
        router.get('/:id',  controller.getReservationById );
        router.delete('/:id', controller.deleteReservationById );

        // ? Reports
        router.get('/user/:id',  ); // ? Reservations by user ID
        router.get('/movie/:id',  ); // ? Reservations by movie ID

        return router;
    }

}
