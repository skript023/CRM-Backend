import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from '../role/role.service';

@Injectable()
export class UsersService 
{
    constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>, private roleService: RoleService)
    {}

    async create(user: CreateUserDto, file: Express.Multer.File)
    {
        user.password = await bcrypt.hash(user.password, 10)

        const role = await this.roleService.find_by_name(user.role_id)

        if (!role) throw new NotFoundException('Create user failed, role not found, try an existing role')

        user.role_id = role._id

        console.log(file.filename)

        user.image = file.filename

        this.userModel.create(user)

        return {
            message: 'Account creation success'
        }
    }

    async users(): Promise<User[]>
    {
        const users = await this.userModel.
        find(null, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).
        populate('role', ['name', 'level', 'access'], 'Role').exec()

        return users;
    }

    async find_by_id(id: string): Promise<User>
    {
        const user = await this.userModel.findById(id, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).
        populate('role', ['name', 'level', 'access'], 'Role').exec()

        return user;
    }

    async find_by_name(username: string)
    {
        return this.userModel.
        findOne({username},  { createdAt: 0, updatedAt: 0, __v: 0 }).
        populate('role', ['name', 'level', 'access'], 'Role').
        exec()
    }
  
    async password_change(id : string, user : UpdatePasswordDto): Promise<User>
    {
        return this.userModel.findByIdAndUpdate(id, user, {
            new: true, runValidators: true
        })
    }

    async update(id: string, user: UpdateUserDto, file: Express.Multer.File)
    {
        const res = await this.userModel.findByIdAndUpdate(id, user, {
            new: true, runValidators: true, select: ['fullname']
        })

        if (!res) throw new NotFoundException('User not found.')

        return {
            message: `Success update ${user.fullname} data`
        }
    }

    async delete(id: string) : Promise<User>
    {
        const res = await this.userModel.findByIdAndDelete(id, {
            select: ['fullname']
        })

        if (!res) throw new NotFoundException('User not found.')

        return res
    }
}
