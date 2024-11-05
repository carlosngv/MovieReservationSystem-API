import { FieldValidators } from "../../../helpers/field-validators";

export class CreateUserDTO {
    private constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly password2: string,
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly profile_picture: string,
        public readonly is_verified: boolean = false,
        public readonly roles: number,
    ) {}

    // ? "roles" references to a Role Table ID
    static create( object: { [ key: string ]: any } ): [ string?, CreateUserDTO? ] {
        const {
            username, email, password, password2, first_name, last_name, profile_picture, is_verified, roles
        } = object;

        if ( !username || username === '' ) return [ 'Missing username', undefined ];
        if ( !FieldValidators.validateEmail( email ) ) return [ 'Email is not valid', undefined ];
        if ( !password || password === '' ) return [ 'Missing password', undefined ];
        if ( !password2 || password2 === '' ) return [ 'Missing password2', undefined ];
        if ( !first_name || first_name === '' ) return [ 'Missing first_name', undefined ];
        if ( !last_name || last_name === '' ) return [ 'Missing last_name', undefined ];
        if ( !roles || roles === '' ) return [ 'Missing roles', undefined ];

        if( password !== password2) return ['Passwords must match', undefined];

        return [ undefined, new CreateUserDTO( username, email, password, password2, first_name, last_name, profile_picture, is_verified, roles ) ];
    }
}
