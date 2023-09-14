import { Controller, Get, Body, Post, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './schema/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/guard/role.guard';
import { Roles } from '../role/decorator/role.decorator';
import { Actions } from '../role/decorator/action.decorator';

@Controller('activity')
export class ActivityController 
{
    constructor(private activityService: ActivityService)
    {}

    @Actions('read')
    @Roles(['admin'])
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get()
    async activities(): Promise<Activity[]>
    {
        return this.activityService.findAll()
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async get_by_id(@Param('id') id: string): Promise<Activity>
    {
        return this.activityService.findById(id)
    }

    @UseGuards(AuthGuard)
    @Post('add')
    async create(@Body() body: CreateActivityDto): Promise<Activity>
    {
        return this.activityService.create(body)
    }

    @UseGuards(AuthGuard)
    @Put('update/:id')
    async update(@Param('id') id: string, @Body() activity: UpdateActivityDto)
    {
        const res = await this.activityService.update(id, activity)

        return {
            message: `Success update ${res.name} activity`
        }
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string)
    {
        const res = await this.activityService.delete(id)

        return {
            message: `Success delete ${res.name} activity `
        }
    }
}
