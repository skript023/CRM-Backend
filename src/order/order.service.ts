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
import response from 'src/interfaces/response.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: mongoose.Model<Order>,
        @InjectModel(Asset.name) private assetModel: mongoose.Model<Asset>,
        @InjectModel(Payment.name) private paymentModel: mongoose.Model<Payment>,
        @InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>,
        private response: response<Order>
    ) {}

    async create(orderData: CreateOrderDto, req: Request) {
        const order = await this.orderModel.create(orderData);

        if (!order) throw new NotFoundException('Failed create order');

        this.response.message = `Success create order`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll() {
        const orders = await this.orderModel.find();

        this.response.message = `Success Get Orders`;
        this.response.success = true;
        this.response.data = orders;

        return this.response.json();
    }

    async findOne(id: string) {
        const order = await this.orderModel.findById(id);

        if (!order) throw new NotFoundException('Order not found');

        this.response.message = `Success Get Order`;
        this.response.success = true;
        this.response.data = order;

        return this.response.json();
    }

    async update(id: string, orderData: UpdateOrderDto) {
        const order = (await this.orderModel
            .findByIdAndUpdate(id, orderData, {
                new: true,
                runValidators: true,
            })
            .populate('product', ['name'])) as any;

        if (!order) throw new NotFoundException('Unable update non-existing order');

        this.response.message = `Success update order ${order.product?.name}`;
        this.response.success = true;
        
        return this.response.json();
    }

    async remove(id: string) {
        const order = (await this.orderModel
            .findByIdAndDelete(id)
            .populate('product', ['name'])) as any;

        if (!order) throw new NotFoundException('Unable delete non-existing order');

        this.response.message = `Success delete order ${order.product?.name}`;
        this.response.success = true;

        return this.response.json();
    }

    async createAsset() {
        const order = (await this.orderModel
            .findOne({ status: 'Completed' })
            .populate('product', ['_id', 'name'])
            .populate('user', ['_id', 'fullname'])) as any;

        const payment = await this.paymentModel.findOne({
            status: 'Completed',
        });

        const now = new Date();

        now.setDate(now.getDate() + 30);

        if (!order || !payment) {
            return;
        }

        await this.assetModel.create({
            user_id: order.user_id,
            product_id: order.product_id,
            payment_id: payment._id,
            license: order.product?.name,
            status: 'Active',
            expired_date: now,
        });

        console.log('Order valid, create asset for user');
    }

    @Interval(1000)
    async handleCronAssetCleaning() {
        await this.createAsset();
    }
}
