import { MovieGenreEntity } from "../../entities/movie-genre.entity";

export class CreateMovieDTO {

    private constructor(
        public readonly movieName: string,
        public readonly movieDescription: string,
        public readonly moviePicture: string,
        public readonly releaseDate: Date,
        public readonly movieGenre: MovieGenreEntity,
    ) {}

    public static create( object: { [ key: string ]: any } ): [ string?, CreateMovieDTO? ] {
        const { movieName, movieDescription, moviePicture, releaseDate, movieGenre } = object;

        if ( !movieName ) return [ 'Missing movieName', undefined ];
        if ( !releaseDate ) return [ 'Missing releaseDate', undefined ];
        if ( !movieGenre ) return [ 'Missing movieGenre', undefined ];

        return [ undefined, new CreateMovieDTO( movieName, movieDescription, moviePicture, releaseDate, movieGenre ) ]
    }

    public toObject() {
        return Object.assign({}, this);
    }

}
