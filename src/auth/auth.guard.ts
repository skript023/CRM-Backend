import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Actions } from '../role/decorator/action.decorator';
import { Roles } from '../role/decorator/role.decorator';
  
@Injectable()
export class AuthGuard implements CanActivate 
{
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> 
    {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromCookie(request);

        const roles = this.reflector.get(Roles, context.getHandler());

        const actions = this.reflector.get(Actions, context.getHandler());

        if (!token) 
        {
            throw new UnauthorizedException();
        }

        try 
        {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.SECRET
                }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = JSON.parse(this.decrypt(payload.encrypted));

            if (!roles && !actions)
            {
                return true;
            }

            const role = request['user']['role']

            const access = role['access']

            if (!role['name']) throw new NotFoundException('Role not found')

            const role_exist = roles.some(value => value === role['name']);

            const action_exist = access[actions]

            if (!role_exist || !action_exist) throw new UnauthorizedException()

            return role_exist && action_exist;
        } 
        catch 
        {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined 
    {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }

    private extractTokenFromCookie(request: Request): string | undefined 
    {
        if (request.cookies && request.cookies.token)
        {
            return request.cookies.token;
        }

        return null;
    }

    private extractToken(request: Request): string | undefined
    {
        const cookie = this.extractTokenFromCookie(request);
        const header = this.extractTokenFromHeader(request);

        console.log(`token: ${header}`)

        return cookie || header
    }

    private decrypt(text: string): string | undefined
    {
        const key = process.env.ENCRPYPT_KEY as string
        return Array.from(text, (c, i) => String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))).join('');
    }
}