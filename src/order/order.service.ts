import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import * as mongoose from 'mongoose'
import { Asset } from 'src/asset/schema/asset.schema';
import { Interval } from '@nestjs/schedule';
import { Payment } from 'src/payment/schema/payment.schema';
import { Request } from 'express';
const stripe = require('stripe')('pk_test_51NxLMSIkxZUSFLxVr4Ca1qzd9pGH43CkDw8wWkCnY2OGiN1FCQV3fa7AbG3WjXpnVCdzDYbvvRE68p2e676DMRyT00Jw69x0Zl');

@Injectable()
export class OrderService 
{
	constructor(
		@InjectModel(Order.name) private orderModel: mongoose.Model<Order>, 
		@InjectModel(Asset.name) private assetModel: mongoose.Model<Asset>,
		@InjectModel(Payment.name) private paymentModel: mongoose.Model<Payment>
	)
    {
	}

	async create(orderData: CreateOrderDto, req: Request) 
	{
		try 
		{
			const order = await (await this.orderModel.create(orderData)).
			populate('product', ['name', 'price']);
			
			stripe.session.checkout.create({
				line_items: [
					{
						product: order.product_id
					}
				],
				mode: 'payment',
				success_url: `${req.protocol}://${req.get('host')}/order/create`,
				cancel_url: `${req.protocol}://${req.get('host')}/order/failed`,
			})
		} 
		catch (error : any) 
		{
			return {
				message: 'Order failed created',
				success: true
			}
		}

		return {
			message: 'Order successfully created',
			success: true
		}
	}

	async findAll() 
	{
		return this.orderModel.find();
	}

	async findOne(id: string) 
	{
		return this.orderModel.findById(id);
	}

	async update(id: string, orderData: UpdateOrderDto) 
	{
		const order = await this.orderModel.findByIdAndUpdate(id, orderData, {
            new: true, runValidators: true
        }).populate('product', ['name']) as any;

		if (!order) throw new NotFoundException("Invalid order");
		

		return {
			message: `Update ${order.product?.name} order success`,
			success: true
		};
	}

	async remove(id: string) 
	{
		const order = await this.orderModel.findByIdAndDelete(id).
		populate('product', ['name']) as any;

		if (!order) throw new NotFoundException('Invalid order');

		return {
			message: `Update ${order.product?.name} order success`,
			success: true
		};
	}

	async createAsset()
	{
		const order = await this.orderModel.findOne({status: 'Completed'}).
		populate('product', ['_id', 'name']).
		populate('user', ['_id', 'fullname']) as any;

		
		const payment = await this.paymentModel.findOne({status: 'Completed'});
		
		const now = new Date();
		
		now.setDate(now.getDate() + 30);
		
		if (!order || !payment)
		{
			return;
		}

		await this.assetModel.create({
			user_id: order.user_id,
			product_id: order.product_id,
			payment_id: payment._id,
			license: order.product?.name,
			status: 'Active',
			expired_date: now
		})
		
		console.log('Order valid, create asset for user');
	}

	@Interval(1000)
    async handleCronAssetCleaning()
    {
		await this.createAsset();
    }
}
