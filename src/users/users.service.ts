import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

import * as fs from 'fs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
    ) {}

    async create(user: CreateUserDto, file: Express.Multer.File) {
        const exist = await this.does_user_exist(user);

        if (exist)
            throw new BadRequestException('Username or Email already used');

        user.password = await bcrypt.hash(user.password, 10);

        if (user.role_id?.length <= 0) {
            user.role_id = '65042e34aca29db82fe65944';
        }

        user.image = file.filename;

        try {
            await this.userModel.create(user);
        } catch {
            throw new InternalServerErrorException();
        }

        return {
            message: 'Account creation success',
            success: true,
        };
    }

    async users(): Promise<User[]> {
        const users = await this.userModel
            .find(null, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('role', ['name', 'level', 'access']);

        return users;
    }

    async find_by_id(id: string): Promise<User> {
        const user = await this.userModel
            .findById(id, { password: 0, updatedAt: 0, __v: 0 })
            .populate('role', ['name', 'level', 'access'])
            .populate('asset', ['license', 'status', 'expired', 'expired_date'])
            .populate('activity', ['name', 'start_date', 'end_date', 'status'])
            .populate('order');

        return user;
    }

    async login(username: string, password: string): Promise<User> {
        const user = await this.userModel.findOne(
            { username },
            { createdAt: 0, updatedAt: 0, __v: 0 },
        );

        if (!user) throw new UnauthorizedException('Credential not found');

        const success = await bcrypt.compare(password, user.password);

        if (!success) {
            throw new UnauthorizedException();
        }

        user.recent_login = new Date().toString();

        user.save();

        return this.userModel.findById(user._id, {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
    }

    async update(id: string, user: UpdateUserDto, file: Express.Multer.File) {
        if (file != null) {
            user.image = file.filename;
        }

        if (user.password != null) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        const result = await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
            select: ['fullname'],
        });

        if (!result) throw new NotFoundException('User not found.');

        return {
            message: `Success update ${result.fullname} data`,
            success: true,
        };
    }

    async delete(id: string): Promise<any> {
        const user = (await this.userModel.findByIdAndDelete(id, {
            select: ['fullname'],
        })) as User;

        if (!user) throw new NotFoundException('User not found.');

        const path = `${__dirname}/assets/binaries/${user.image}`;

        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }

        return {
            message: `Success delete ${user.fullname} data`,
            success: true,
        };
    }

    private async does_user_exist(
        userCreation: CreateUserDto,
    ): Promise<boolean> {
        const user = await this.userModel
            .find({
                $or: [
                    { username: userCreation.username },
                    { email: userCreation.email },
                ],
            })
            .exec();

        if (user.length !== 0) {
            return true;
        }

        return false;
    }
}
