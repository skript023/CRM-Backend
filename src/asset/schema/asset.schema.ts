import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true
    },
    toObject: {
        getters: true,
        virtuals: true
    }
})

export class Asset
{
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string
    @Prop({ type: SchemaTypes.ObjectId, required: true })
    user_id: string
    @Prop({ type: SchemaTypes.ObjectId, required: true })
    product_id: string
    @Prop({ required: true })
    license: string
    @Prop({ required: true })
    payment: string
    @Prop()
    expired: boolean
};

export const AssetSchema = SchemaFactory.createForClass(Asset);

AssetSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

AssetSchema.virtual('product_detail', {
    ref: 'Product',
    localField: 'product_id',
    foreignField: '_id',
    justOne: true
});
