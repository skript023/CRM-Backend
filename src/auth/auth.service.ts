import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService 
{
    constructor(private usersService: UsersService, private jwtService: JwtService)
    {}

    async signIn(username : string, password : string) : Promise<any>
    {
        const user = await await this.usersService.login(username, password);

        const payload = { 
            user
        };

        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
}
