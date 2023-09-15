import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, UseInterceptors, Put, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../role/decorator/role.decorator';
import { RolesGuard } from '../role/guard/role.guard';
import { Actions } from '../role/decorator/action.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('user')
export class UsersController 
{
    constructor(private userService: UsersService) {}

    @Post('add')
    @Roles(['admin'])
    @Actions('read')
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const name = file.originalname.split('.')[0];
                const extension = file.originalname.split('.')[1];
                const filename = `${name}_${Date.now()}.${extension}`

                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            {
                return cb(null, false)
            }

            cb(null, true)
        }
    }))
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
    async image(@Param('name') name, @Res() res: Response)
    {
        res.sendFile(name, {root: './uploads'})
    }

    @Delete('avatar/delete/:name')
    async delete_image(@Param('name') name)
    {
        fs.unlinkSync(`./uploads/${name}`)
    }

    @Get()
    @Roles(['admin'])
    @Actions('read')
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    async users() : Promise<User[]> 
    {
        return this.userService.users();
    }

    @Get('detail/:id') 
    async get_by_id(@Param('id') id: string): Promise<User>
    {
        return this.userService.find_by_id(id);
    }

    @Patch('update/password/:id')
    async password_change(@Param('id') id: string, @Body() user: UpdatePasswordDto) 
    {
        //let data = user
        //data.password = await bcrypt.hash(user.password, 10)

        const res = await this.userService.password_change(id, user)
    
        return {
            message: `${res.fullname} change password successfully`
        }
    }

    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const name = file.originalname.split('.')[0];
                const file_extension = file.originalname.split('.')[1];
                const filename = name.split('').join('_') + '_' + Date.now() + '.' + file_extension;

                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(null, false)
            }

            cb(null, true)
        }
    }))
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, file: Express.Multer.File)
    {
        return this.userService.update(id, updateUserDto, file); 
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
