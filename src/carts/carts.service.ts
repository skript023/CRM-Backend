import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import * as mongoose from 'mongoose';
import response from '../interfaces/response.dto';

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>,
        private response: response<Cart>
    ) {}

    async create(cartData: CreateCartDto) {
        const exist = await this.cartModel.findOne({
            product_id: cartData.product_id,
        });

        if (exist)
        {
            cartData.quantity += exist.quantity;

            const cart = await this.cartModel.findByIdAndUpdate(
                exist._id,
                cartData,
            );

            if (!cart) throw new NotFoundException('Invalid data');

            this.response.message = 'Successfully is already exist in cart';
            this.response.success = true;

            return this.response.json();
        }
        else
        {
            await this.cartModel.create(cartData);

            this.response.message = 'Successfully added to cart';
            this.response.success = true;

            return this.response.json();
        }
    }

    async findAll() 
    {
        const carts = await this.cartModel.find().populate('order').populate('product');

        this.response.message = 'Success retrieve carts';
        this.response.success = true;
        this.response.data = carts;

        return this.response.json(); 
    }

    async findOne(id: string) 
    {
        const carts = await this.cartModel
                .find({ user_id: id })
                .populate('order')
                .populate('product');

        if (!carts) throw new NotFoundException('Invalid user cart');

        this.response.message = 'Success retrieve cart';
        this.response.success = true;
        this.response.data = carts;

        return this.response.json(); 
    }

    async update(id: string, cartData: UpdateCartDto) 
    {
        const cart = await this.cartModel.findOneAndUpdate({ product_id: id }, cartData, { new: true, runValidators: true });

        if (!cart) throw new NotFoundException('data invalid');

        this.response.message = 'Success update cart';
        this.response.success = true;

        return this.response.json();
    }

    async remove(id: string) 
    {
        const cart = await this.cartModel.findOneAndDelete({
            product_id: id,
        });

        if (!cart) throw new NotFoundException('data invalid');

        this.response.message = 'Success delete cart';
        this.response.success = true;

        return this.response.json();
    }
}
