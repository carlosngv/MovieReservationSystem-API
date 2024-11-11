import { Prisma } from "@prisma/client";
import { prisma } from "../../data/mysql/mysql.config";
import { CreateMovieDTO } from "../../domain/dtos/movies/create-movie.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { MovieEntity } from "../../domain/entities/movie.entity";
import { UpdateMovieDTO } from "../../domain/dtos/movies/update-movie.dto";
import { CreateScheduleDto } from "../../domain/dtos/movies/create-schedule.dto";
import { MovieScheduleEntity } from "../../domain/entities/movie-schedule.entity";
import { UpdateScheduleDTO } from "../../domain/dtos/movies/update-schedule.dto";


export class MovieService {

    getMovies = async () => {
        try {
            const moviesDb = await prisma.movie.findMany();

            const movies = moviesDb.map( m => MovieEntity.getFromObject( m ));

            return movies;
        } catch (error) {
            console.log(error);
            throw CustomError.internalError();
        }
    }

    deleteMovieById = async( id: number ) => {
        try {

            const deletedMovie = await prisma.movie.delete({ where: { movie_id: id } });
            return MovieEntity.getFromObject( deletedMovie );

        } catch (error) {
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    getMovieGenres = async() => {
        try {
            const genres = await prisma.movie_genre.findMany();
            return genres;
        } catch (error) {
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    async getMovieById( id: number ) {
        try {
            const dbMovie = await prisma.movie.findUnique({ where: { movie_id: id } });
            if( !dbMovie ) throw CustomError.notFound();
            return MovieEntity.getFromObject( dbMovie );
        } catch (error) {
            console.log(error);
            throw CustomError.internalError();
        }
    }

    async createMovie ( createMovieDto: CreateMovieDTO ) {
        try {
            let movie: Prisma.movieUncheckedCreateInput;

            movie = {
                movie_name: createMovieDto.movieName,
                release_date: new Date(createMovieDto.releaseDate).toISOString(),
                movie_description: createMovieDto.movieDescription,
                movie_picture: createMovieDto.moviePicture,
                movie_genre: createMovieDto.movieGenre.movie_genre_id,
            }
            const newMovie = await prisma.movie.create({ data: movie });
            console.log( { newMovie } );
            return MovieEntity.getFromObject( newMovie );

        } catch( error ) {
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    async updateMovie( updateMovieDto: UpdateMovieDTO ) {

        try {
            const udpatedMovieDb = await prisma.movie.update( {
                where: {
                    movie_id: updateMovieDto.movie_id,
                },
                data: updateMovieDto.values,
            });
            const movie = MovieEntity.getFromObject( udpatedMovieDb );

            return movie;

        } catch (error) {

            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }

    }

    async createMovieSchedule( createScheduleDto: CreateScheduleDto ){

        try {

            let scheduleData: Prisma.scheduled_movieCreateInput = {
                capacity: createScheduleDto.capacity,
                start_date: new Date(createScheduleDto.start_date).toISOString(),
                end_date: new Date(createScheduleDto.start_date).toISOString(),
                movie: {
                    connect: {
                        movie_id: createScheduleDto.movie_id,
                    }
                }
            }

            const dbSchedule = await prisma.scheduled_movie.create({
                data: scheduleData
            });

            if( !dbSchedule ) throw CustomError.internalError();

            return MovieScheduleEntity.fromObject( dbSchedule );


        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);

        }

    }

    async getSchedules() {
        try {
            const schedules = await prisma.scheduled_movie.findMany();
            return schedules.map( s => MovieScheduleEntity.fromObject( s ) );

        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    async getScheduleById( id: number ) {

        try {

            const dbSchedule = await prisma.scheduled_movie.findUnique({
                where: {
                    scheduled_movie_id: id,
                }
            });

            if( !dbSchedule ) {
                throw CustomError.notFound();

            }

            return MovieScheduleEntity.fromObject(dbSchedule);


        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }

    }

    async updateSchedule( updateScheduleDto: UpdateScheduleDTO ) {

        const { scheduled_movie_id } = updateScheduleDto;

        if( !(await this.getScheduleById( scheduled_movie_id)) ) {
            throw CustomError.notFound();
        }

        try {

            const deletedSchedule = await prisma.scheduled_movie.update({
                where: {
                    scheduled_movie_id: scheduled_movie_id
                },
                data: updateScheduleDto.values
            });

            return MovieScheduleEntity.fromObject( deletedSchedule );

        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }

    }

    async deleteSchedule( id: number ) {


        if( !(await this.getScheduleById( id )) ) {
            throw CustomError.notFound();
        }

        try {
            const deletedSchedule = await prisma.scheduled_movie.delete({ where: { scheduled_movie_id: id } });
            return MovieScheduleEntity.fromObject( deletedSchedule );
        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

}
