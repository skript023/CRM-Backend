import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    NotFoundException,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UploadedFile,
    Res,
    Redirect,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new FileTypeValidator({ fileType: 'image' }),
                ],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.userService.create(createUserDto, file);
    }

    @Get('avatar/:name')
    image(@Param('name') name, @Res() res: Response) {
        if (fs.existsSync(`${__dirname}/assets/avatar/${name}`)) {
            res.sendFile(name, { root: `${__dirname}/assets/avatar/` });
        } else {
            res.redirect(
                `https://cdn.glitch.global/134e6d29-f12e-4932-87e4-2031bac5ad1d/${name}`,
            );
        }
    }

    @Delete('avatar/delete/:name')
    delete_image(@Param('name') name) {
        fs.unlinkSync(`${__dirname}/assets/avatar/${name}`);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new FileTypeValidator({ fileType: 'image' }),
                ],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.userService.update(id, updateUserDto, file);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Get('profile/detail')
    getProfile(@Request() req) {
        return req.user;
    }
}
