export class UpdateMovieDTO {

    private constructor(
        public readonly movie_id: number,
        public readonly movie_name?: string,
        public readonly movie_description?: string,
        public readonly movie_picture?: string,
        public readonly release_date?: Date,
        public readonly movie_genre?: number,
    ) {}

    public static create( object: { [ key: string ]: any } ): [ string?, UpdateMovieDTO? ] {

        const { movie_id, movie_name, movie_description, movie_picture, release_date, movie_genre } = object;


        if( !movie_id ) return [ 'Missing movie_id', undefined ];

        return [ undefined, new UpdateMovieDTO( movie_id, movie_name, movie_description, movie_picture, release_date, movie_genre ) ]
    }

    public toObject() {
        return Object.assign({}, this);
    }

    get values() {
        let returnObj: { [ key: string ]: any} = {};
        let thisObj = this.toObject();
        for( let [key, value] of Object.entries( thisObj )) {
            if (key !== 'movie_id' && value ) returnObj[ key ] = value;
        }

        return returnObj;
    }

}
