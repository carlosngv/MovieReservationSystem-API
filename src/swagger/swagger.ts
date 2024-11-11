import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Movie Reservation System API',
            version: '1.0.0',
            description: 'Is a service that allow users to sign up, log in, browse movies, reserve seats for specific showtimes, and manage their reservations. The system features a token-based user authentication, movie and showtime management, seat reservation functionality, and a simple reporting on reservations. The application is based on the Domain-Driven Design principles, since this approach emphasizes creating a rich domain model that reflects the business requirements.',
            contact: {
                name: 'developer'
            },
            servers: {
                url: 'http://localhost:3200',
                description: 'local server'
            }
        }
    },
    apis: [ './src/swagger/*.yml' ],
};

export const specs = swaggerJsdoc( options );
