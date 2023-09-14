import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, isNotEmpty } from 'class-validator';

export class CreateUserDto 
{
    @Expose()
    @IsNotEmpty()
    role: string
    @Expose()
    @IsNotEmpty()
    readonly fullname: string
    @Expose()
    @IsNotEmpty()
    readonly username: string
    @Expose()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string
    @IsNotEmpty()
    @MinLength(8)
    @Exclude({ toPlainOnly: true })
    password: string
    readonly hardware_id: string
    readonly computer_name: string
    readonly expired: string
    readonly recent_login: string
    readonly remember_token: string
}
