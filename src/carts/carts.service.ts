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
            const exist = await this.cartModel.findOne({ product_id: cartData.product_id });

            if (exist)
            {
                cartData.quantity += exist.quantity;

                const cart = await this.cartModel.findByIdAndUpdate(exist._id, cartData);

                return {
                    message: 'Successfully added to cart',
                    success: true
                }
            }
            else
            {
                await this.cartModel.create(cartData);

                return {
                    message: 'Successfully added to cart',
                    success: true
                }
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
        return this.cartModel.find().populate('order').populate('product');
    }

    async findOne(id: string)
    {
        const carts = this.cartModel.find({ user_id: id }).populate('order').populate('product');

        if (!carts) throw new NotFoundException('Invalid user');

        return carts;
    }

    async update(id: string, cartData: UpdateCartDto)
    {
        try
        {
            const cart = await this.cartModel.findOneAndUpdate({product_id: id}, cartData);

            if (!cart) throw new NotFoundException('data invalid');

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
        try
        {
            const cart = await this.cartModel.findOneAndDelete({ product_id: id});

            if (!cart) throw new NotFoundException('data invalid');

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
