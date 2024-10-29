export class CustomError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ) {
        super( message );
    }

    static badRequest( message: string ) {
        return new CustomError( 400, message );
    }

    static internalError() {
        return new CustomError( 500, 'Interval server error.' );
    }

    static unauthorized( message: string ) {
        return new CustomError( 401, message );
    }

    static notFound() {
        return new CustomError( 404, 'Not found' );
    }

}
