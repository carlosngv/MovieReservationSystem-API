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

    static internalError( message?: string ) {
        if( !message ) message = 'Interval server error.';
        return new CustomError( 500, message );
    }

    static unauthorized( message: string ) {
        return new CustomError( 401, message );
    }

    static notFound( message: string = 'Not found' ) {
        return new CustomError( 404, message );
    }

}
