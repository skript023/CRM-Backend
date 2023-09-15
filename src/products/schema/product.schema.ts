import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { ProductGrade } from "../enum/product.enum";

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


export class Product
{
    @Prop({ type: mongoose.SchemaTypes.ObjectId, auto: true })
    _id: string

    @Prop({ required: true })
    code: number

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    grade: ProductGrade

    @Prop({ required: true })
    game: string

    @Prop({ required: true })
    target: string

    @Prop({ required: true })
    file: string

    @Prop()
    version: string

    @Prop()
    status: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)