import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

const midtrans = require('midtrans-client');

@Injectable()
export class PaymentService {
	create(createPaymentDto: CreatePaymentDto) {
		return 'This action adds a new payment';
	}

	findAll() {
		return `This action returns all payment`;
	}

	findOne(id: number) {
		return `This action returns a #${id} payment`;
	}

	update(id: number, updatePaymentDto: UpdatePaymentDto) {
		return `This action updates a #${id} payment`;
	}

	remove(id: number) {
		return `This action removes a #${id} payment`;
	}

	async make_payment()
	{
		let snap = new midtrans.Snap({
			// Set to true if you want Production Environment (accept real transaction).
			isProduction: false,
			serverKey: process.env.SERVER_KEY
		});

		let parameter = {
			"transaction_details": {
				"order_id": order._id,
				"gross_amount": order.product.price
			},
			"credit_card": {
				"secure": true
			},
			"customer_details": {
				"fullname": order.user.fullname,
				"username": order.user.username,
				"email": order.user.email
			}
		};

		snap.createTransaction(parameter)
		.then((transaction) => {
			// transaction token
			this.transaction_token = transaction.token;
		});
		return this.transaction_token;
	}

	private transaction_token
}
