import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController 
{
	constructor(private readonly orderService: OrderService) {}

	@Post()
	async create(@Body() createOrderDto: CreateOrderDto) 
	{
		return this.orderService.create(createOrderDto);
	}

	@Get()
	async findAll() 
	{
		return this.orderService.findAll();
	}

	@Get('detail/:id')
	async findOne(@Param('id') id: string) 
	{
		return this.orderService.findOne(id);
	}

	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) 
	{
		return this.orderService.update(id, updateOrderDto);
	}

	@Delete('delete/:id')
	async remove(@Param('id') id: string) 
	{
		return this.orderService.remove(id);
	}
}
