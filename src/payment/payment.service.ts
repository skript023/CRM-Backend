import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/payment.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

import * as mongoose from 'mongoose';

const midtrans = require('midtrans-client');

@Injectable()
export class PaymentService
{
	constructor(@InjectModel(Payment.name) private paymentModel: mongoose.Model<Payment>) { }

	async create(paymentData: CreatePaymentDto)
	{
		try
		{
			const create = await this.paymentModel.create(paymentData);
			const order = await create.populate('order');
			const payment = await order.populate('user', ['fullname', 'username', 'email']) as any;

			let snap = new midtrans.Snap({
				// Set to true if you want Production Environment (accept real transaction).
				isProduction: false,
				serverKey: process.env.SERVER_KEY
			});

			let parameter = {
				"transaction_details": {
					"order_id": payment.order_id,
					"gross_amount": payment.product.price
				},
				"credit_card": {
					"secure": true
				},
				"customer_details": {
					"fullname": payment.user.fullname,
					"username": payment.user.username,
					"email": payment.user.email
				}
			};

			snap.createTransaction(parameter)
				.then((transaction) => {
					// transaction token
					this.transaction_token = transaction.token;
				});
			return this.transaction_token;
		}
		catch (e: any)
		{
			return {
				message: `Failed create payment, exception occured ${e}`,
				success: false
			};
		}
	}

	async findAll()
	{
		return this.paymentModel.find().populate('user', ['fullname', 'username', 'email']).populate('product', ['name', 'price']).populate('order');
	}

	async findOne(id: string)
	{
		return this.paymentModel.findById(id).populate('user', ['fullname', 'username', 'email']).populate('product', ['name', 'price']).populate('order');
	}

	async update(id: string, paymentData: UpdatePaymentDto)
	{
		try
		{
			const payment = await this.paymentModel.findByIdAndUpdate(id, paymentData, {
				new: true, runValidators: true
			});

			if (!payment) throw new NotFoundException('invalid payment');

			return {
				message: 'Payment updated successfully',
				success: true
			};
		}
		catch(e: any)
		{
			return {
				message: `Failed update payment, exception occured ${e}`,
				success: false
			};
		}
	}

	async remove(id: string)
	{
		try
		{
			const payment = await this.paymentModel.findByIdAndUpdate(id);

			if (!payment) throw new NotFoundException('invalid payment');

			return {
				message: 'Payment delete successfully',
				success: true
			};
		}
		catch (e: any)
		{
			return {
				message: `Failed delete payment, exception occured ${e}`,
				success: false
			};
		}
	}

	async make_payment(paymentData: CreatePaymentDto)
	{
		
	}

	private transaction_token
}
