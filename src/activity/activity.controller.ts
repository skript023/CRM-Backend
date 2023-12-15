import {
    Controller,
    Get,
    Body,
    Post,
    Param,
    Put,
    Delete,
    Patch,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './schema/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('activity')
export class ActivityController {
    constructor(private activityService: ActivityService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.activityService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.activityService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateActivityDto) {
        return this.activityService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() activity: UpdateActivityDto) {
        return this.activityService.update(id, activity);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.activityService.remove(id);
    }
}
