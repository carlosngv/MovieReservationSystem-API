import { Prisma } from "@prisma/client";
import { prisma } from "../../data/mysql/mysql.config";
import { CreateMovieDTO } from "../../domain/dtos/movies/create-movie.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { MovieEntity } from "../../domain/entities/movie.entity";
import { UpdateMovieDTO } from "../../domain/dtos/movies/update-movie.dto";


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
            console.log(error);
            throw CustomError.internalError();
        }
    }

    getMovieGenres = async() => {
        try {
            const genres = await prisma.movie_genre.findMany();
            return genres;
        } catch (error) {
            console.log(error);
            throw CustomError.internalError();
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
            console.log(error);
            throw CustomError.internalError();
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
            console.log(error);
            throw CustomError.internalError();
        }

    }

}
