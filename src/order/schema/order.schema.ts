import { Prop, Schema } from "@nestjs/mongoose";
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

    @Prop({ type:SchemaTypes.ObjectId, auto: true })
    product_id: string

    @Prop({ required: true })
    quantity: number

    @Prop({ default: 'Open' })
    status: string
}
