export class MovieScheduleEntity {

    private constructor(
        public scheduled_movie_id: number,
        public capacity: number,
        public start_date: Date,
        public end_date: Date,
        public movie_id: number,
    ) {}

    static fromObject( object: { [ key: string ]: any } ) {

        const { scheduled_movie_id, capacity, start_date, end_date, movie_id } = object;

        return new MovieScheduleEntity( scheduled_movie_id, capacity, start_date, end_date, movie_id );
    }

}
