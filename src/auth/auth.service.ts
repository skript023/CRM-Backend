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
        const user = await await this.usersService.find_by_name(username);

        const success = await bcrypt.compare(password, user?.password)

        if (!success) 
        {
            throw new UnauthorizedException();
        }

        const payload = { 
            _id: user._id,
            fullname: user['fullname'],
            username: user['username'],
            email: user['email'],
            expired: user['expired'],
            role: user['role']
        };

        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
}
