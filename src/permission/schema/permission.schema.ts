import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

export class Permission 
{
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string;

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    role_id: string;

    @Prop({ type: String, required: true })
    domain: string;

    @Prop({ type: String })
    type: string;

    @Prop({ type: String })
    route: string;

    @Prop({ type: Boolean })
    active: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);