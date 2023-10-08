import { Request } from 'express';
import { Interval } from '@nestjs/schedule';
import { Order } from './schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../carts/schema/cart.schema';
import { Asset } from 'src/asset/schema/asset.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Payment } from 'src/payment/schema/payment.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

import * as mongoose from 'mongoose';

@Injectable()
export class OrderService 
{
	constructor(
		@InjectModel(Order.name) private orderModel: mongoose.Model<Order>, 
		@InjectModel(Asset.name) private assetModel: mongoose.Model<Asset>,
		@InjectModel(Payment.name) private paymentModel: mongoose.Model<Payment>,
		@InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>
	)
    {}

	async create(orderData: CreateOrderDto, req: Request) 
	{
		try 
		{
			const doc = await this.orderModel.create(orderData);

			return {
				message: 'Order added to cart',
				success: true
			};
		} 
		catch (error : any) 
		{
			return {
				message: 'Order failed created',
				success: false
			}
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
