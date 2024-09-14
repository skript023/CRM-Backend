import { Injectable, Logger } from '@nestjs/common';
import { CreateEllohimDto } from './dto/create-ellohim.dto';
import { UpdateEllohimDto } from './dto/update-ellohim.dto';

@Injectable()
export class EllohimService 
{
	async create(createEllohimDto: CreateEllohimDto) 
	{
		Logger.debug(createEllohimDto.os);
		Logger.debug(createEllohimDto.cpu);
		Logger.debug(createEllohimDto.gpu);
		Logger.debug(createEllohimDto.motherboard);

		return 'Data received by Ellohim';
	}

	async findAll() {
		return `This action returns all ellohim`;
	}

	async findOne(id: number) {
		return `This action returns a #${id} ellohim`;
	}

	async update(id: number, updateEllohimDto: UpdateEllohimDto) 
	{
		return `This action updates a #${id} ellohim`;
	}

	async remove(id: number) {
		return `This action removes a #${id} ellohim`;
	}

	async ping()
	{
		return 'Ellohim is responding';
	}

	async hardwareCheck()
	{

	}
}
