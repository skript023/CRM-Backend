import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { OrderController } from './order.controller';
import { UserSchema } from '../users/schema/user.schema';
import { CartSchema } from '../carts/schema/cart.schema';
import { AssetSchema } from 'src/asset/schema/asset.schema';
import { PaymentSchema } from 'src/payment/schema/payment.schema';
import { ConfigModule } from '@nestjs/config';
import response from 'src/interfaces/response.dto';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Order', schema: OrderSchema },
            { name: 'Asset', schema: AssetSchema },
            { name: 'Payment', schema: PaymentSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Cart', schema: CartSchema },
        ]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
    ],
    controllers: [OrderController],
    providers: [OrderService, response<Order>],
})
export class OrderModule {}
