import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartSchema } from './schema/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Cart', schema: CartSchema }
        ]),
    ],
    controllers: [CartsController],
    providers: [CartsService],
})
export class CartsModule {}
