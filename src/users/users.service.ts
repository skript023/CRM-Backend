import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService 
{
    constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>)
    {}

    async create(user: CreateUserDto) : Promise<User>
    {
        return this.userModel.create(user)
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

    async update(id: string, user: UpdateUserDto) : Promise<User>
    {
        const res = await this.userModel.findByIdAndUpdate(id, user, {
            new: true, runValidators: true, select: ['fullname']
        })

        if (!res) throw new NotFoundException('User not found.')

        return res
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
