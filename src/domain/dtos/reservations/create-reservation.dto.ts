export class CreateReservationDTO {

    private constructor(
        public readonly scheduled_movie_id: Number,
        public readonly user_id: Number,
        public readonly seat: string,
    ){}

    static create( object: { [ key: string ]: any } ): [ string?, CreateReservationDTO? ] {
        const { scheduled_movie_id, user_id, seat } = object;

        if ( !scheduled_movie_id) return [ 'Missing scheduled_movie_id', undefined ];
        if ( !user_id) return [ 'Missing user_id', undefined ];
        if ( !seat) return [ 'Missing seat', undefined ];

        return [ undefined, new CreateReservationDTO( scheduled_movie_id, user_id, seat ) ];
    }


}
