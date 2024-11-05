
export class LoginUserDTO {
    private constructor(
        public readonly username: string,
        public readonly password: string,
    ) {}

    static create( object: { [ key: string ]: any } ): [ string?, LoginUserDTO? ] {
        const { username, password } = object;

        if( !username ) return ['Missing username', undefined];
        if( !password ) return ['Missing password', undefined];

        return [ undefined, new LoginUserDTO( username, password) ];
    }

}
