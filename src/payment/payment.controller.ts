import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post()
	async create(@Body() createPaymentDto: CreatePaymentDto)
	{
		return this.paymentService.create(createPaymentDto);
	}

	@Get()
	async findAll()
	{
		return this.paymentService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string)
	{
		return this.paymentService.findOne(id);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto)
	{
		return this.paymentService.update(id, updatePaymentDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string)
	{
		return this.paymentService.remove(id);
	}
}
