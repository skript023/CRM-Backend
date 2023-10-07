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

export class Order 
{
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user_id: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Carts' })
    carts_id: string[]

    @Prop({ required: true })
    quantity: number

    @Prop({ default: 'Open' })
    status: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.virtual('carts', {
    ref: 'Cart',
    localField: 'carts_id',
    foreignField: '_id'
})

OrderSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
})