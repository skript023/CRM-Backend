import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import * as mongoose from 'mongoose';

@Injectable()
export class CartsService
{
    constructor(@InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>) { }

    async create(cartData: CreateCartDto)
    {
        try
        {
            await this.cartModel.create(cartData);

            return {
                message: 'Successfully added to cart',
                success: true
            }
        }
        catch(e: any)
        {
            return {
                message: `Failed added to cart, exception occured ${e}`,
                success: false
            }
        }
    }

    async findAll()
    {
        return this.cartModel.find().populate('order');
    }

    async findOne(id: string)
    {
        return this.cartModel.findById(id).populate('order');
    }

    async update(id: string, cartData: UpdateCartDto)
    {
        try
        {
            const cart = await this.cartModel.findByIdAndUpdate(id, cartData);

            if (!cart) return {
                message: 'Failed update cart, data invalid',
                success: false
            };

            return {
                message: `Cart updated successfully`,
                success: true
            };
        }
        catch(e: any)
        {
            return {
                message: `Failed update cart, exception occured ${e}`,
                success: false
            };
        }
    }

    async remove(id: string)
    {
        try {
            const cart = await this.cartModel.findByIdAndUpdate(id);

            if (!cart) return {
                message: 'Failed update cart, data invalid',
                success: false
            };

            return {
                message: `Cart delete successfully`,
                success: true
            };
        }
        catch(e: any)
        {
            return {
                message: `Failed delete cart, exception occured ${e}`,
                success: false
            };
        }
    }
}
