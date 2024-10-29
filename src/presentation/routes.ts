import { Router } from "express"
import { MoviesRoutes } from "./movies/movies.routes";
import { AuthRoutes } from "./auth/auth.routes";

export class Routes {
    static get routes() {
        const router = Router();

        router.use('/auth', AuthRoutes.routes);
        router.use('/movies', MoviesRoutes.routes);


        return router;
    }
}
