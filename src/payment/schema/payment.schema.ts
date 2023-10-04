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
export class Payment 
{
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string

    @Prop({ required: true })
    amount: number

    @Prop({ default: 'Pending' })
    status: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);