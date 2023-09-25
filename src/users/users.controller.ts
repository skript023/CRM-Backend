import { Controller, Get, Post, Body, Patch, Param, Delete, Request, NotFoundException, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('user')
export class UsersController 
{
    constructor(private userService: UsersService) {}

    @Post('add')
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() createUserDto: CreateUserDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1000000 }),
            new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
    })) file : Express.Multer.File) 
    {
        return this.userService.create(createUserDto, file);
    }

    @Get('avatar/:name')
    @Auth()
    async image(@Param('name') name, @Res() res: Response)
    {
        res.sendFile(name, {root: './assets'})
    }

    @Delete('avatar/delete/:name')
    async delete_image(@Param('name') name)
    {
        fs.unlinkSync(`./uploads/${name}`)
    }

    @Get()
    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    async users() : Promise<User[]> 
    {
        return this.userService.users();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get('detail/:id') 
    async get_by_id(@Param('id') id: string): Promise<User>
    {
        return this.userService.find_by_id(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1000000 }),
            new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
    })) file: Express.Multer.File)
    {
        return this.userService.update(id, updateUserDto, file); 
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'delete'
    })
    @Delete('delete/:id')
    async delete(@Param('id') id: string) 
    {
        return this.userService.delete(id);
    }

    @Auth()
    @Get('profile')
    async getProfile(@Request() req)
    {
        return req.user;
    }
}
