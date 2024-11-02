import { Request, Response } from "express";
import { MovieService } from "../services/movie.service";
import { CustomError } from "../../domain/errors/custom-errors";
import { CreateMovieDTO } from "../../domain/dtos/movies/create-movie.dto";
import { APIResponse } from "../interfaces/api-response.interface";
import { MovieEntity } from "../../domain/entities/movie.entity";
import { UpdateMovieDTO } from "../../domain/dtos/movies/update-movie.dto";
import Logger from "../../config/logger.config";

export class MoviesController {

    // TODO: DI
    constructor( private movieService: MovieService ) {}

    private handleError = ( res: Response, error: any ) => {
        const response: APIResponse<null, typeof error> = {
            data: null,
            error: error,
            success: false,
        }
        if( error instanceof CustomError ) {
            Logger.error( JSON.stringify( response ) );
            res.status( error.statusCode ).json( response );
            return
        }

        res.status(500).json( response );
    }

    public getMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;

        this.movieService.getMovieById( parseInt( id ) )
            .then( m => {
                const response: APIResponse<MovieEntity, null> = {
                    data: m,
                    error: null,
                    success: true,
                }
                Logger.info(`Movie with ID ${ id } fetched.`);
                res.status(200).json( response );
            })
            .catch( error => this.handleError( res, error ));

    }

    public getAllMovies = ( req: Request, res: Response ) => {
        this.movieService.getMovies()
            .then( movies => {

                const response: APIResponse<MovieEntity[], null> = {
                    data: movies,
                    error: null,
                    success: true,
                }
                Logger.info('Movies fetched.');
                res.status(200).json( response );
            })
            .catch( error =>  this.handleError( res, error ) );
    }

    public getMovieGenres = ( req: Request, res: Response ) => {
        this.movieService.getMovieGenres()
            .then( moviesGenres => {

                const response: APIResponse<typeof moviesGenres, null> = {
                    data: moviesGenres,
                    error: null,
                    success: true,
                }

                res.status(200).json( response )
            })
            .catch( error =>  this.handleError( res, error ) );
    }



    public createMovie = ( req: Request, res: Response ) => {

        const [ errorMessage, createMovieDTO ] = CreateMovieDTO.create( req.body );

        if( errorMessage ) {
            this.handleError( res, errorMessage );
            return;
        }

        this.movieService.createMovie( createMovieDTO! )
            .then( createdMovie => {
                const response: APIResponse<MovieEntity, null> = {
                    data: createdMovie,
                    error: null,
                    success: true,
                }
                Logger.info(`Movie created - ${ JSON.stringify( createdMovie ) }`);
                res.status(201).json( response )
            } )
            .catch( error =>  this.handleError( res, error ) );
    }

    public updateMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;
        console.log(req.body)
        const [ errorMessage, updateMovieDto ] = UpdateMovieDTO.create( { ...req.body , movie_id: parseInt(id) });

        if( errorMessage ) {
            this.handleError( res, errorMessage );
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
            .catch( error => this.handleError( res, error ));
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
            .catch( error => this.handleError( res, error ));
    }


}
