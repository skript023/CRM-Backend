import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

export class Cart
{
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user_id: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
    product_id: string

    @Prop({ required: true, default: 1 })
    quantity: number
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id'
})

CartSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'cart_id',
    justOne: true
})

CartSchema.virtual('product', {
    ref: 'Product',
    localField: 'product_id',
    foreignField: '_id',
    justOne: true
})