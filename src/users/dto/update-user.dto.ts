import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateUserDto
{
    readonly fullname: string
    readonly username: string
    @IsEmail()
    readonly email: string
    @Exclude()
    readonly hardware_id: string
    readonly computer_name: string
    readonly expired: string
    readonly recent_login: string
    readonly remember_token: string
}