import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from '../role/role.service';
import * as fs from 'fs'

@Injectable()
export class UsersService 
{
    constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>, private roleService: RoleService)
    {}

    async create(user: CreateUserDto, file: Express.Multer.File)
    {
        if (this.does_user_exist(user)) throw new BadRequestException('Username or Email already used')

        user.password = await bcrypt.hash(user.password, 10);

        if (user.role_id)
        {
            const role = await this.roleService.find_by_name(user.role_id);

            if (!role) throw new NotFoundException('Create user failed, role not found, try an existing role');

            user.role_id = role._id;
        }
        else
        {
            user.role_id = '65042e34aca29db82fe65944';
        }

        user.image = file.filename;

        console.log(user)

        try
        {
            this.userModel.create(user);
        }
        catch
        {
            throw new InternalServerErrorException()
        }

        return {
            message: 'Account creation success'
        };
    }

    async users(): Promise<User[]>
    {
        const users = await this.userModel.
            find(null, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).
            populate('role', ['name', 'level', 'access']);

        return users;
    }

    async find_by_id(id: string): Promise<User>
    {
        const user = await this.userModel.findById(id, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).
            populate('role', ['name', 'level', 'access']);

        return user;
    }

    async login(username: string, password: string) : Promise<User>
    {
        const user = await this.userModel.findOne({ username }, { createdAt: 0, updatedAt: 0, __v: 0 }).populate('role', ['name', 'level', 'access']);

        if (!user) throw new UnauthorizedException('Credential not found');

        const success = await bcrypt.compare(password, user.password);

        if (!success)
        {
            throw new UnauthorizedException();
        }

        return (await this.userModel.findById(user._id, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).populate('role', ['name', 'level', 'access'])).toJSON();
    }
  
    async update(id: string, updatedData: UpdateUserDto, file: Express.Multer.File)
    {
        let data: any = {};

        if (!updatedData) throw new BadRequestException('Invalid param exception');

        if (file != null)
        {
            const user = await this.userModel.findById(id);

            if (user.image == file.filename)
            {
                fs.unlinkSync(`${file.path}/${file.filename}`);
            }

            data.image = file.filename;
        }

        if (updatedData.password != null)
        {
            data.password = await bcrypt.hash(updatedData.password, 10);
        }

        data.fullname = updatedData.fullname;
        data.username = updatedData.username;
        data.email = updatedData.email;
        data.hardware_id = updatedData.hardware_id;
        data.computer_name = updatedData.computer_name;

        const res = await this.userModel.findByIdAndUpdate(id, data, {
            new: true, runValidators: true, select: ['fullname']
        });

        if (!res) throw new NotFoundException('User not found.')

        return {
            message: `Success update ${res.fullname} data`
        };
    }

    async delete(id: string) : Promise<any>
    {
        const res = await this.userModel.findByIdAndDelete(id, {
            select: ['fullname']
        })

        if (!res) throw new NotFoundException('User not found.')

        return {
            message: `Success delete ${res.fullname} data`
        }
    }

    private async does_user_exist(userCreation: CreateUserDto): Promise<boolean> {
        const user = await this.userModel.findOne({ username: userCreation.username });

        if (user) {
            return true;
        }

        return false;
    }
}
