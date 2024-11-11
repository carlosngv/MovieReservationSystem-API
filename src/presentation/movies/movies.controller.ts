import { Request, Response } from "express";
import { MovieService } from "../services/movie.service";
import { CustomError } from "../../domain/errors/custom-errors";
import { CreateMovieDTO } from "../../domain/dtos/movies/create-movie.dto";
import { APIResponse } from "../interfaces/api-response.interface";
import { MovieEntity } from "../../domain/entities/movie.entity";
import { UpdateMovieDTO } from "../../domain/dtos/movies/update-movie.dto";
import Logger from "../../config/logger.config";
import { handleError } from "../helpers/handleControllerError.helper";
import { CreateScheduleDto } from "../../domain/dtos/movies/create-schedule.dto";
import { MovieScheduleEntity } from "../../domain/entities/movie-schedule.entity";
import { UpdateScheduleDTO } from "../../domain/dtos/movies/update-schedule.dto";

export class MoviesController {

    // TODO: DI
    constructor( private movieService: MovieService ) {}

    public getMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.movieService.getMovieById( parseInt( id ) )
            .then( m => {
                const response: APIResponse<MovieEntity, undefined> = {
                    data: m,
                    success: true,
                }
                Logger.info(`Movie with ID ${ id } fetched.`);
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ));

    }

    public getAllMovies = ( req: Request, res: Response ) => {
        this.movieService.getMovies()
            .then( movies => {

                const response: APIResponse<MovieEntity[], undefined> = {
                    data: movies,
                    success: true,
                }
                Logger.info('Movies fetched.');
                res.status(200).json( response );
            })
            .catch( error =>  handleError( res, error ) );
    }

    public getMovieGenres = ( req: Request, res: Response ) => {
        this.movieService.getMovieGenres()
            .then( moviesGenres => {

                const response: APIResponse<typeof moviesGenres, undefined> = {
                    data: moviesGenres,
                    success: true,
                }

                res.status(200).json( response )
            })
            .catch( error =>  handleError( res, error ) );
    }



    public createMovie = ( req: Request, res: Response ) => {

        const [ errorMessage, createMovieDTO ] = CreateMovieDTO.create( req.body );

        if( errorMessage ) {
            handleError( res, errorMessage );
            return;
        }

        this.movieService.createMovie( createMovieDTO! )
            .then( createdMovie => {
                const response: APIResponse<MovieEntity, undefined> = {
                    data: createdMovie,
                    success: true,
                }
                Logger.info(`Movie created - ${ JSON.stringify( createdMovie ) }`);
                res.status(201).json( response )
            } )
            .catch( error =>  handleError( res, error ) );
    }

    public updateMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;
        console.log(req.body)
        const [ errorMessage, updateMovieDto ] = UpdateMovieDTO.create( { ...req.body , movie_id: parseInt(id) });

        if( errorMessage ) {
            handleError( res, errorMessage );
            return;
        }

        this.movieService.updateMovie( updateMovieDto! )
            .then( m => {

                const response: APIResponse<any, null> = {
                    data: m,
                    error: null,
                    success: true,
                }
                Logger.info(`Movie with ID ${ id } updated.`);
                res.status(201).json( response );

            })
            .catch( error => handleError( res, error ));
    }

    public deleteMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.movieService.deleteMovieById( parseInt( id ) )
            .then( m => {
                const response: APIResponse<MovieEntity, null> = {
                    data: m,
                    error: null,
                    success: true,
                }
                Logger.info(`Movie with ID ${ id } deleted.`);
                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ));
    }

    getMovieScheduleById = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.movieService.getScheduleById( Number( id ) )
            .then( sch => {
                const response: APIResponse<MovieScheduleEntity, undefined> = {
                    data: sch,
                    success: true,
                }

                res.status(201).json( response );
            } )
            .catch( error => handleError( res, error ) );
    }

    getMovieSchedules = ( req: Request, res: Response ) => {

        this.movieService.getSchedules()
            .then( sch => {
                const response: APIResponse<MovieScheduleEntity[], undefined> = {
                    data: sch,
                    success: true,
                }

                res.status(201).json( response );
            } )
            .catch( error => handleError( res, error ) );


    }

    createMovieSchedule = ( req: Request, res: Response ) => {

        const [ errorMessage, createScheduleDto ] = CreateScheduleDto.create( req.body );

        if( errorMessage ) {
            handleError( res, errorMessage );
            return;
        }

        this.movieService.createMovieSchedule( createScheduleDto! )
            .then( sch => {
                const response: APIResponse<MovieScheduleEntity, undefined> = {
                    data: sch,
                    success: true,
                }

                res.status(201).json( response );
            } )
            .catch( error => handleError( res, error ) );

    }

    updateMovieSchedule = ( req: Request, res: Response ) => {
        const { id } = req.params;
        const [ errorMessage, updateScheduleDto ] = UpdateScheduleDTO.create( { ...req.body, scheduled_movie_id: Number(id) } );

        if( errorMessage ) {
            handleError( res, errorMessage );
            return;
        }

        this.movieService.updateSchedule( updateScheduleDto! )
            .then( sch => {
                const response: APIResponse<MovieScheduleEntity, undefined> = {
                    data: sch,
                    success: true,
                }

                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ) );

    }

    deleteMovieSchedule = ( req: Request, res: Response ) => {

        const { id } = req.params;

        this.movieService.deleteSchedule( Number(id) )
            .then( sch => {
                const response: APIResponse<MovieScheduleEntity, undefined> = {
                    data: sch,
                    success: true,
                }

                res.status(200).json( response );
            })
            .catch( error => handleError( res, error ) );

    }


}
