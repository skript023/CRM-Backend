import { IsEmail, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { User } from '../schema/user.schema';

export class UpdateUserDto
{
    role_id: string
    @ValidateIf(param => param.fullname != null)
    @IsString()
    readonly fullname: string
    @ValidateIf(param => param.username != null)
    @IsString()
    @MaxLength(32)
    readonly username: string
    @ValidateIf(param => param.email != null)
    @IsString()
    @IsEmail()
    readonly email: string
    @ValidateIf((param: User) => { return param.password != null || param.password.length > 0 })
    @IsString()
    @MinLength(8)
    password: string
    readonly hardware_id: string
    readonly computer_name: string
    image: string
    readonly expired: string
    readonly recent_login: string
    readonly remember_token: string
}