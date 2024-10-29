import { Router } from "express";
import { MoviesController } from "./movies.controller";

export class MoviesRoutes {

    static get routes() {

        const router = Router();
        const controller = new MoviesController();

        router.get('/', controller.getAllMovies );
        router.get('/:id', controller.getMovie );
        router.post('/new', controller.createMovie );
        router.put('/:id', controller.updateMovie );
        router.delete('/:id', controller.deleteMovie );

        return router;

    }

}
