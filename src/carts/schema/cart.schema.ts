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

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
    product_id: string
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'carts_id'
})

CartSchema.virtual('product', {
    ref: 'Product',
    localField: 'product_id',
    foreignField: '_id',
    justOne: true
})