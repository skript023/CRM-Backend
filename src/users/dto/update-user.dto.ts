import { IsEmail, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateUserDto
{
    role_id: string
    readonly fullname: string
    readonly username: string
    @IsEmail()
    readonly email: string
    @MinLength(8)
    password: string
    readonly hardware_id: string
    readonly computer_name: string
    image: string
    readonly expired: string
    readonly recent_login: string
    readonly remember_token: string
}