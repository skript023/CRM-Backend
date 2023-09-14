import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from './decorator/role.decorator';
import { RolesGuard } from './guard/role.guard';
import { Actions } from './decorator/action.decorator';

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Actions('create')
    @Roles(['admin'])
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Post('add')
    async create(@Body() createRoleDto: CreateRoleDto) : Promise<any>
    {
        const role = await this.roleService.create(createRoleDto);

        return {
            message: `Create role ${role.name} success`
        }
    }

    @Actions('read')
    @Roles(['admin'])
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get()
    async findAll() : Promise<Role[]>
    {
        return this.roleService.findAll();
    }


    @Roles(['admin', 'user', 'staff'])
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get('detail/:id')
    async findOne(@Param('id') id: string) : Promise<Role>
    {
        return this.roleService.findOne(id);
    }

    @Actions('update')
    @Roles(['admin'])
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) : Promise<any>
    {
        const role = await this.roleService.update(id, updateRoleDto);

        return {
            message: `Update role ${role.name} success`
        }
    }

    @Actions('delete')
    @Roles(['admin'])
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Delete('delete/:id')
    async remove(@Param('id') id: string) : Promise<any>
    {
        const role = await this.roleService.remove(id);

        return {
            message: `Delete role ${role.name} success`
        } 
    }
}
