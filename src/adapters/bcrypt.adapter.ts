import bcrypt from 'bcryptjs';

export class BcryptAdapter {

    static hashPassword( password: string ) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync( password, salt );
    }

    static comparePassword( password: string, hashed: string ) {
        return bcrypt.compareSync( password, hashed );
    }

}
