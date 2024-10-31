import { CustomError } from "../errors/custom-errors";

export class MovieEntity {

    private constructor(
        public movie_id: number,
        public movie_name: string,
        public movie_description: string,
        public movie_picture: string,
        public release_date: Date,
        public movie_genre: number,

    ) {}

    static getFromObject( object: { [ key: string ]: any } ) {
        const { movie_id, movie_name, movie_description, movie_picture, release_date, movie_genre } = object;

        if ( !movie_id ) throw CustomError.badRequest('id missing');
        if ( !movie_name ) throw CustomError.badRequest('movieName missing');
        if ( !release_date ) throw CustomError.badRequest('releaseDate missing');
        if ( !movie_genre ) throw CustomError.badRequest('movieGenre missing');

        return new MovieEntity( movie_id, movie_name, movie_description, movie_picture, release_date, movie_genre );

    }

}
