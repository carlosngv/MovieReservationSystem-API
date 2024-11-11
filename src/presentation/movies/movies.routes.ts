import { Router } from "express";
import { MoviesController } from "./movies.controller";
import { MovieService } from "../services/movie.service";

export class MoviesRoutes {

    static get routes() {

        const router = Router();
        const controller = new MoviesController( new MovieService() );

        router.get('/', controller.getAllMovies );
        router.get('/genres', controller.getMovieGenres );

        // ? Schedules
        router.get('/schedules', controller.getMovieSchedules );
        router.post('/schedules', controller.createMovieSchedule );
        router.post('/schedules/new-schedule', controller.createMovieSchedule );
        router.put('/schedules/:id', controller.updateMovieSchedule );
        router.get('/schedules/:id', controller.getMovieScheduleById );
        router.delete('/schedules/:id', controller.deleteMovieSchedule );

        router.get('/:id', controller.getMovie );
        router.post('/', controller.createMovie );
        router.put('/:id', controller.updateMovie );
        router.delete('/:id', controller.deleteMovie );

        return router;

    }

}
