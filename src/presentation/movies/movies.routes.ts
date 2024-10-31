import { Router } from "express";
import { MoviesController } from "./movies.controller";
import { MovieService } from "../services/movie.service";

export class MoviesRoutes {

    static get routes() {

        const router = Router();
        const controller = new MoviesController( new MovieService() );

        router.get('/', controller.getAllMovies );
        router.get('/genres', controller.getMovieGenres );
        router.get('/:id', controller.getMovie );
        router.post('/', controller.createMovie );
        router.put('/:id', controller.updateMovie );
        router.delete('/:id', controller.deleteMovie );

        return router;

    }

}
