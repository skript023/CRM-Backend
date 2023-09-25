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

        const encrypted = await this.encrypt(JSON.stringify(user));

        const payload = { encrypted };

        return {
            token: await this.jwtService.signAsync(payload)
        };
    }

    private async encrypt(text: string): Promise<string>
    {
        const key = process.env.ENCRPYPT_KEY as string
        return Array.from(text, (c, i) => String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))).join('');
    }
}
