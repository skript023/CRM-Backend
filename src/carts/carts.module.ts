import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './schema/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import response from '../interfaces/response.dto';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    ],
    controllers: [CartsController],
    providers: [CartsService, response<Cart>],
})
export class CartsModule {}
