import { Prisma } from "@prisma/client";
import { prisma } from "../../data/mysql/mysql.config";
import { CreateUserDTO } from "../../domain/dtos/auth/create-user.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthService {

    // TODO: Email DI
    constructor() {}

    async getUserById( email: string ) {
        try {
            const dbUser = await prisma.user.findUnique({
                where: {
                    email: email,
                }
            });

            if( !dbUser ) return false;

            return true;

        } catch (error) {
            console.log( { error } );
            CustomError.internalError(`${ error }`);
        }
    }

    // ? For m-t-m relations
    // ? * Creates user
    // ? * Creates a new record in the relation table user_roles
    // ? * Connects existing role by role_id from dto
    async createUser( createUserDto: CreateUserDTO ) {
        try {

            const userById =  await this.getUserById( createUserDto.email );

            if( userById ) throw CustomError.badRequest('User already exists');

            let prismaUser: Prisma.userCreateInput = {
                username: createUserDto.username,
                email: createUserDto.email,
                password: createUserDto.password,
                first_name: createUserDto.first_name,
                last_name: createUserDto.last_name,
                profile_picture: createUserDto.profile_picture,
                is_verified: Number(createUserDto.is_verified),
                user_roles: {
                    create: [
                        {
                            role: {
                                connect: { role_id: createUserDto.roles }
                            }
                        }
                    ]
                },
            };

            const dbUser = await prisma.user.create({
                data: prismaUser
            });

            console.log({dbUser})

            if( !dbUser ) throw CustomError.internalError();

            const user = UserEntity.fromObject( dbUser );
            // console.log( user )
            return user;

        } catch (error) {
            console.log(`${ error }`);
            CustomError.internalError();
        }
    }

}
