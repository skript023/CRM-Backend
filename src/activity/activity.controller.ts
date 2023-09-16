import { Controller, Get, Body, Post, Param, Put, Delete, Patch } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './schema/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('activity')
export class ActivityController 
{
    constructor(private activityService: ActivityService)
    {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get()
    async activities(): Promise<Activity[]>
    {
        return this.activityService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get(':id')
    async get_by_id(@Param('id') id: string): Promise<Activity>
    {
        return this.activityService.findById(id)
    }

    async get_by_user_id(@Param('id') user_id: string): Promise<Activity>
    {
        return this.activityService.findById(user_id);
    }

    @Auth()
    @Post('add')
    async create(@Body() body: CreateActivityDto): Promise<Activity>
    {
        return this.activityService.create(body);
    }

    @Auth()
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() activity: UpdateActivityDto)
    {
        const res = await this.activityService.update(id, activity);

        return {
            message: `Success update ${res.name} activity`
        };
    }

    @Auth()
    @Delete('delete/:id')
    async delete(@Param('id') id: string)
    {
        const res = await this.activityService.delete(id);

        return {
            message: `Success delete ${res.name} activity `
        };
    }
}
