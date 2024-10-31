import { RoleEntity } from "./role.entity";

export class UserEntity {

    private constructor(
        public user_id: number,
        public username: string,
        public email: string,
        public password: string,
        public first_name: string,
        public last_name: string,
        public profile_picture: string,
        public is_verified: boolean,
        public roles: RoleEntity[],
    ){}

    public addRole( role: RoleEntity ) {
        if( !this.roles.find( r => r.role_id === role.role_id )) {
            this.roles.push( role );
        }
    }

    public removeRole( role_id: number ) {
        this.roles = this.roles.filter( r => r.role_id === role_id );
    }

    static fromObject( object: { [ key: string ]: any }) {

    }

}
