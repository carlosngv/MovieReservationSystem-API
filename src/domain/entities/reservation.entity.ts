import { MovieScheduleEntity } from "./movie-schedule.entity";
import { UserEntity } from "./user.entity";

export class ReservationEntity {

    private constructor(
        public movie_reservation_id: string,
        public scheduled_movie: MovieScheduleEntity,
        public ticket_id: number,
        public reserved_at: Date,
        public user: UserEntity,
        public seat: string,
    ){}

    static fromObject( object: { [ key: string ]: any } ) {
        const { scheduled_movie, user, dbReservation } = object;
        const { movie_reservation_id, ticket_id, reserved_at, seat } = dbReservation;

        return new ReservationEntity( movie_reservation_id, scheduled_movie, ticket_id, reserved_at, user, seat );
    }

}
