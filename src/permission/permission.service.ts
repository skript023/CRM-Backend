import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schema/permission.schema';
import mongoose from 'mongoose';
import response from 'src/interfaces/response.dto';

@Injectable()
export class PermissionService 
{
	constructor(@InjectModel(Permission.name) private permissionModel: mongoose.Model<Permission>, private response: response<Permission>) 
	{}

	async create(createPermissionDto: CreatePermissionDto) 
	{
		const permission = await this.permissionModel.create(createPermissionDto);

		this.response.success = true;
		this.response.message = 'Permission created successfully';
	
		return this.response.json();
	}

	async findAll() 
	{
		const permissions = await this.permissionModel.find();

        this.response.success = true;
        this.response.message = 'Permissions retrieved successfully';
        this.response.data = permissions;

        return this.response.json();
	}

	async findOne(id: string) 
	{
		const permission = await this.permissionModel.findById(id);

        if (!permission) throw new NotFoundException('Permission not found');

        this.response.success = true;
        this.response.message = 'Permission retrieved successfully';
        this.response.data = permission;

        return this.response.json();
	}

	async update(id: string, updatePermissionDto: UpdatePermissionDto)
	{
		const permission = await this.permissionModel.findByIdAndUpdate(id, updatePermissionDto, { new: true });

        if (!permission) throw new NotFoundException('Permission not found');

        this.response.success = true;
        this.response.message = 'Permission updated successfully';
        this.response.data = permission;

        return this.response.json();
	}

	async remove(id: string) 
	{
		const permission = await this.permissionModel.findByIdAndDelete(id);

        if (!permission) throw new NotFoundException('Permission not found');

        this.response.success = true;
        this.response.message = 'Permission deleted successfully';

        return this.response.json();
	}
}
