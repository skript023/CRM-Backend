import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto 
{
    @IsNotEmpty()
    role_id: string
    @IsNotEmpty()
    readonly fullname: string
    @IsNotEmpty()
    readonly username: string
    @IsNotEmpty()
    @IsEmail()
    readonly email: string
    @IsNotEmpty()
    @MinLength(8)
    password: string
    readonly hardware_id: string
    readonly computer_name: string
    image: string
    readonly expired: string
    readonly recent_login: string
    readonly remember_token: string
}
