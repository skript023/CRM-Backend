import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Activity } from './schema/activity.schema';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel(Activity.name)
        private activityModel: mongoose.Model<Activity>,
    ) {}

    getHello(): string {
        return 'Hello Activity';
    }

    async findAll(): Promise<Activity[]> {
        const activities = await this.activityModel
            .find(null, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        return activities;
    }

    async create(activity: CreateActivityDto): Promise<Activity> {
        const res = await this.activityModel.create(activity);

        return res;
    }

    async findById(id: string): Promise<Activity> {
        const res = await this.activityModel
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        if (!res) throw new NotFoundException('Activity not found.');

        return res;
    }

    async update(id: string, activity: UpdateActivityDto): Promise<Activity> {
        const res = await this.activityModel.findByIdAndUpdate(id, activity, {
            new: true,
            runValidators: true,
        });

        if (!res) throw new NotFoundException('Activity not found.');

        return res;
    }

    async delete(id: string): Promise<Activity> {
        const res = await this.activityModel.findByIdAndDelete(id);

        if (!res) throw new NotFoundException('Activity not found.');

        return res;
    }
}
