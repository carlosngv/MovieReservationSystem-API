import { RoleEntity } from "./role.entity";

export class UserEntity {

    private constructor(
        public user_id: number,
        public username: string,
        public email: string,
        public first_name: string,
        public last_name: string,
        public profile_picture: string,
        public is_verified: boolean,
        public password?: string,

    ){}

    // public addRole( role: RoleEntity ) {
    //     if( !this.roles.find( r => r.role_id === role.role_id )) {
    //         this.roles.push( role );
    //     }
    // }

    // public removeRole( role_id: number ) {
    //     this.roles = this.roles.filter( r => r.role_id === role_id );
    // }

    static fromObject( object: { [ key: string ]: any }) {
        const { user_id, username, email, password, first_name, last_name, profile_picture, is_verified } = object;

        return new UserEntity( user_id, username, email, first_name, last_name, profile_picture, is_verified, password );
    }

}
