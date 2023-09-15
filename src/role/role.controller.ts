import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { Auth } from '../auth/auth.decorator';

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'create'
    })
    @Post('add')
    async create(@Body() createRoleDto: CreateRoleDto) : Promise<any>
    {
        const role = await this.roleService.create(createRoleDto);

        return {
            message: `Create role ${role.name} success`
        }
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get()
    async findAll() : Promise<Role[]>
    {
        return this.roleService.findAll();
    }


    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get('detail/:id')
    async findOne(@Param('id') id: string) : Promise<Role>
    {
        return this.roleService.findOne(id);
    }

    @Auth({
        role: ['admin'],
        access: 'update'
    })
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) : Promise<any>
    {
        const role = await this.roleService.update(id, updateRoleDto);

        return {
            message: `Update role ${role.name} success`
        }
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'delete'
    })
    @Delete('delete/:id')
    async remove(@Param('id') id: string) : Promise<any>
    {
        const role = await this.roleService.remove(id);

        return {
            message: `Delete role ${role.name} success`
        } 
    }
}
