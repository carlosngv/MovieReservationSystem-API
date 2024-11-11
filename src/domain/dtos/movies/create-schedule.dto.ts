export class CreateScheduleDto {

    private constructor(
        public readonly capacity: number,
        public readonly start_date: Date,
        public readonly end_date: Date,
        public readonly movie_id: number,
    ) {}

    static create( object: { [ key: string ]: any } ): [ string?, CreateScheduleDto? ] {
        const { capacity, start_date, end_date, movie_id } = object;

        if ( !capacity ) return [ 'Missing capacity', undefined ];
        if ( !start_date ) return [ 'Missing start_date', undefined ];
        // if ( !end_date ) return [ 'Missing end_date', undefined ];
        if ( !movie_id ) return [ 'Missing movie_id', undefined ];

        return [ undefined, new CreateScheduleDto( capacity, start_date, end_date, movie_id ) ]

    }

}
