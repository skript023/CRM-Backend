import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Product } from "../../products/schema/product.schema";

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
export class Payment 
{
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user_id: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Order' })
    order_id: string

    @Prop({ required: true })
    amount: number

    @Prop({ default: 'Pending' })
    status: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
})

PaymentSchema.virtual('order', {
    ref: 'Order',
    localField: 'order_id',
    foreignField: '_id',
    justOne: true
})