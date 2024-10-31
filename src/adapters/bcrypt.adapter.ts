import bcrypt from 'bcrypt';

export class BcryptAdapter {

    static hashPassword( password: string ) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync( password, salt );
    }

    static comparePasswrd( password: string, hashedPassword: string ) {
        return bcrypt.compareSync( password, hashedPassword );
    }

}
