import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Payment {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string;

    @Prop({ type: Number, required: true })
    code: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user_id: string;

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'Order' })
    order_id: string[];

    @Prop({ type: String, required: true })
    transaction_id: string;

    @Prop({ type: String, required: true })
    merchant_id: string;

    @Prop({ type: Number, required: true })
    gross_amount: number;

    @Prop({ type: String, default: null })
    name: string;

    @Prop({ type: String, default: null })
    description: string;

    @Prop({ type: String, required: true })
    currency: string;

    @Prop({ type: String, required: true })
    payment_type: string;

    @Prop({ type: String, required: true })
    transaction_status: string;

    @Prop({ type: String, required: true })
    transaction_time: string;
    
    @Prop({ type: String, required: true })
    fraud_status: string;
    
    @Prop({ type: String, required: true })
    expiry_time: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true,
});
