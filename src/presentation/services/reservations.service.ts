import { Prisma } from "@prisma/client";
import { prisma } from "../../data/mysql/mysql.config";
import { CreateReservationDTO } from "../../domain/dtos/reservations/create-reservation.dto";
import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { CustomError } from "../../domain/errors/custom-errors";
import { MovieService } from "./movie.service";
import { AuthService } from "./auth.service";
import { UpdateScheduleDTO } from "../../domain/dtos/movies/update-schedule.dto";
import { MovieScheduleEntity } from "../../domain/entities/movie-schedule.entity";
import { UserEntity } from "../../domain/entities/user.entity";

export class ReservationService {

    constructor(
        private movieService: MovieService = new MovieService(),
        private authService: AuthService = new AuthService(),
    ) {}


    getAllReservations = async() => {

        try {
            const dbReservations = await prisma.movie_reservation.findMany({
                include: {
                    scheduled_movie: true,
                    user: true,
                }
            });

            if( !dbReservations || dbReservations.length === 0 ) throw CustomError.notFound('No reservations have been maded');

            return dbReservations.map( r  =>  {
                return this.setReservationEntity( r );
            });

        } catch (error) {

            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }


    }

    getReservationByID = async( id: number ) => {
        try {

            const dbReservation = await prisma.movie_reservation.findUnique({
                where: {
                    movie_reservation_id: id
                },
                include: {
                    scheduled_movie: true,
                    user: true,
                }
            });

            if( !dbReservation ) throw CustomError.notFound('Reservation not found');

            return this.setReservationEntity( dbReservation );

        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    getReservationsByUserID = async( id: number ): Promise<ReservationEntity[]> => {
        try {

            const dbUser = await this.authService.getUserById( id );
            if( !dbUser ) throw CustomError.notFound( 'User not found' );

            const dbReservations = await prisma.movie_reservation.findMany({
                where: { user_id: id },
                include: {
                    scheduled_movie: true,
                    user: true,
                }
            });

            if( !dbReservations || dbReservations.length === 0 ) throw CustomError.notFound('There are not reservations for this user');

            const reservations = dbReservations.map( r  =>  {
                return this.setReservationEntity( r );
            });
            return reservations;


        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }
    getReservationsByMovieID = async( id: number ): Promise<ReservationEntity[]> => {
        try {

            const dbMovie = await this.movieService.getMovieById( id );
            if( !dbMovie ) throw CustomError.notFound( 'Movie not found' );

            const dbReservations = await prisma.movie_reservation.findMany({
                where: { scheduled_movie_id: id },
                include: {
                    scheduled_movie: true,
                    user: true,
                }
            });

            if( !dbReservations || dbReservations.length === 0 ) throw CustomError.notFound('There are not reservations for this movie');

            const reservations = dbReservations.map( r  =>  {
                return this.setReservationEntity( r );
            });
            return reservations;


        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    createReservation = async ( createReservationDTO: CreateReservationDTO ) => {

        try {

            const dbSchedule = await this.movieService.getScheduleById( Number(createReservationDTO.scheduled_movie_id) );
            if(!dbSchedule) throw CustomError.notFound( 'Schedule not available' );

            const dbUser = await this.authService.getUserById( Number( createReservationDTO.user_id ) );
            if(!dbUser) throw CustomError.notFound( 'User not found' );

            let reservation: Prisma.movie_reservationCreateInput = {
                ticket_id: Math.floor(Math.random() * 2000),
                reserved_at: new Date(),
                seat: createReservationDTO.seat,
                user: {
                    connect: {
                        user_id: Number(createReservationDTO.user_id)
                    }
                },
                scheduled_movie: {
                    connect: {
                        scheduled_movie_id: Number(createReservationDTO.scheduled_movie_id),
                    }
                },

            }

            // ? Updates movie schedule capacity
            const [ availableCapacity, isValidCapacity ] = this.validCapacity( dbSchedule );
            if( !isValidCapacity ) throw CustomError.badRequest('Schedule capacity exceded.');
            const [ err, updateScheduleDTO ] = UpdateScheduleDTO.create({ capacity: availableCapacity, scheduled_movie_id: dbSchedule.scheduled_movie_id })
            await this.movieService.updateSchedule( updateScheduleDTO! );

            // ? Checks seat availability

            const isSeatOccupied = await this.isSeatOccupied( createReservationDTO.seat, Number(createReservationDTO.scheduled_movie_id) );
            if( isSeatOccupied ) throw CustomError.badRequest(`Seat ${ createReservationDTO.seat } is not available`);

            const dbReservation = await prisma.movie_reservation.create( {
                data: reservation
            } );
            if( !dbReservation ) throw CustomError.internalError();

            return ReservationEntity.fromObject( {
                dbReservation,
                user: dbUser,
                scheduled_movie: dbSchedule
            } );

        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }

    }

    deleteReservationByID = async ( id: number ) => {

        try {

            const dbReservation = await this.getReservationByID( id );
            if( !dbReservation ) throw CustomError.notFound('Reservation not found');

            const { scheduled_movie } = dbReservation;

            if( new Date() < scheduled_movie.start_date ) throw CustomError.badRequest('Cancellation window has been closed');

            // ? Increase scheduled movie capacity
            const [ err, updateScheduleDTO ] = UpdateScheduleDTO.create({
                scheduled_movie_id: scheduled_movie.scheduled_movie_id,
                capacity: scheduled_movie.capacity + 1,
            });
            await this.movieService.updateSchedule( updateScheduleDTO! );

            await prisma.movie_reservation.delete({ where: { movie_reservation_id: id } });

            return;
        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }

    }

    validCapacity = ( schedule: MovieScheduleEntity ): [ number, boolean] => {
        const availableCapacity = schedule.capacity - 1;
        if( availableCapacity < 0 ) return [ 0, false ];

        return [ availableCapacity, true ];
    }

    isSeatOccupied = async( seat: string, scheduled_movie_id: number ) => {
        try {

            const dbReservation = await prisma.movie_reservation.findFirst({
                where: {
                    seat,
                    scheduled_movie_id
                }
            });

            if( dbReservation ) return true;

            return false;

        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }
    }

    setReservationEntity = ( dbReservation: { [ key: string ]: any } ) => {

        try {
            const user = dbReservation.user;
            const {password, ...userEntity} = UserEntity.fromObject( user );
            const scheduleEntity = MovieScheduleEntity.fromObject(dbReservation.scheduled_movie);
            return ReservationEntity.fromObject({ dbReservation, user: userEntity, scheduled_movie: scheduleEntity });
        } catch (error) {
            console.log(`${ error }`)
            if( error instanceof CustomError ) {
                throw error;
            }
            throw CustomError.internalError(`${ JSON.stringify( error ) }`);
        }

    }

}
