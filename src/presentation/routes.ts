import { Router } from "express"
import { MoviesRoutes } from "./movies/movies.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { ReservationRoutes } from "./reservations/reservations.routes";

export class Routes {
    static get routes() {
        const router = Router();

        router.use('/auth', AuthRoutes.routes);
        router.use('/movies', [ AuthMiddleware.verifyJWT ], MoviesRoutes.routes);
        router.use('/reservations', ReservationRoutes.routes);

        return router;
    }
}
