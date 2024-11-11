import { Prisma } from "@prisma/client";
import { prisma } from "../../data/mysql/mysql.config";
import { CreateUserDTO } from "../../domain/dtos/auth/create-user.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { UserEntity } from "../../domain/entities/user.entity";
import { BcryptAdapter } from "../../adapters/bcrypt.adapter";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { JWTAdapter } from "../../adapters/jwt.adapter";

export class AuthService {

    // TODO: Email DI
    constructor() {}

    async getUserById( user_id: number ) {
        try {
            const dbUser = await prisma.user.findUnique({
                where: {
                    user_id,
                }
            });

            if( !dbUser ) return false;

            const { password, ...user} = UserEntity.fromObject(dbUser);

            return user;

        } catch (error) {
            console.log( { error } );
            CustomError.internalError(`${ error }`);
        }
    }

    async getUserByEmail( email: string ) {
        try {
            const dbUser = await prisma.user.findUnique({
                where: {
                    email: email,
                }
            });

            if( !dbUser ) return false;

            return dbUser;

        } catch (error) {
            console.log( { error } );
            CustomError.internalError(`${ error }`);
        }
    }

    async loginUser( loginUserDto: LoginUserDTO ) {
        let errorMessage: string;

        try {
            console.log({loginUserDto})
            const userById =  await this.getUserByEmail( loginUserDto.email );

            if( !userById ) throw CustomError.badRequest('User does not exists');
            const { password, ...user } = UserEntity.fromObject( userById ); // ? Omits password on entity

            const isPasswordValid = BcryptAdapter.comparePassword( loginUserDto.password, userById.password );
            if( !isPasswordValid ) throw CustomError.badRequest('Invalid credentials');

            const token = await JWTAdapter.signToken( { user_id: user.user_id, email: user.email } );

            return { ...user, token}

        } catch (error) {

            if( error instanceof CustomError ) {
                throw error;
            }

            throw  CustomError.internalError(`${ error }`);
        }
    }

    // ? For m-t-m relations
    // ? * Creates user
    // ? * Creates a new record in the relation table user_roles
    // ? * Connects existing role by role_id from dto
    async createUser( createUserDto: CreateUserDTO ) {
        try {

            const userById =  await this.getUserByEmail( createUserDto.email );

            if( userById ) throw CustomError.badRequest('User already exists');

            let prismaUser: Prisma.userCreateInput = {
                username: createUserDto.username,
                email: createUserDto.email,
                password: BcryptAdapter.hashPassword( createUserDto.password ),
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


            if( !dbUser ) throw CustomError.internalError();
            const token = await JWTAdapter.signToken( { user_id: dbUser.user_id, email: dbUser.email } );

            // ? Password is discarded
            const { password, ...user} = UserEntity.fromObject( dbUser );

            return { ...user, token };

        } catch (error) {
            console.log(`${ error }`);
            throw CustomError.internalError();
        }
    }

}
