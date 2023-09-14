import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt'
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleService } from '../role/role.service';
import { Roles } from '../role/decorator/role.decorator';
import { RolesGuard } from '../role/guard/role.guard';
import { Actions } from '../role/decorator/action.decorator';

@Controller('user')
export class UsersController 
{
    constructor(private userService: UsersService, private roleService: RoleService) {}

    @Post('add')
    async create(@Body() createUserDto: CreateUserDto) 
    {
        let data = createUserDto

        data.password = await bcrypt.hash(createUserDto.password, 10)

        const role = await this.roleService.find_by_name(createUserDto.role)

        if (!role) throw new NotFoundException('Role not found, create user failed, try an existing role')

        data.role = role._id

        return this.userService.create(createUserDto);
    }

    @Roles(['admin'])
    @Actions('read')
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get()
    async users() : Promise<User[]> 
    {
        return this.userService.users();
    }

    @UseGuards(AuthGuard)
    @Get('detail/:id') 
    async get_by_id(@Param('id') id: string): Promise<User>
    {
        return this.userService.find_by_id(id);
    }

    @Patch('update/password/:id')
    async password_change(@Param('id') id: string, @Body() user: UpdatePasswordDto) 
    {
        let data = user
        data.password = await bcrypt.hash(user.password, 10)

        const res = await this.userService.password_change(id, user)
    
        return {
            message: `${res.fullname} change password successfully`
        }
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) : Promise<any>
    {
        const user = await this.userService.update(id, updateUserDto);
    
        return {
            message: `Success update ${user.fullname} data`
        }
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string) 
    {
        const user = await this.userService.delete(id);

        return {
            message: `Success delete ${user.fullname} data`
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req)
    {
        return req.user;
    }
}
