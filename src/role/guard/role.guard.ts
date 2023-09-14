import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Actions } from '../decorator/action.decorator';
import { Roles } from '../decorator/role.decorator';
import { AccessAction } from '../enum/access.enum';
import { Role } from '../schema/role.schema';

@Injectable()
export class RolesGuard implements CanActivate
{
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const roles = this.reflector.get(Roles, context.getHandler());

        const actions = this.reflector.get(Actions, context.getHandler());

        const request = context.switchToHttp().getRequest();

        if (!roles)
        {
            return true;
        }

        const token = this.extractTokenFromCookie(request);

        if (!token)
        {
            throw new UnauthorizedException();
        }

        const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: process.env.SECRET
            }
        );

        request['user'] = payload;

        const role = request.user.role as Role

        const access = request.user.role.access as AccessAction

        if (!role.name) throw new NotFoundException('Role not found')

        const role_exist = roles.some(value => value === role.name);

        const action_exist = access[actions]

        if (!role_exist) throw new UnauthorizedException()

        if (role_exist && action_exist) return role_exist && action_exist;

        return role_exist
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
}