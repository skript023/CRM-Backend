import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { Payment, PaymentSchema } from './schema/payment.schema';
import { UserSchema } from '../users/schema/user.schema';
import { OrderSchema } from '../order/schema/order.schema';
import { AssetSchema } from '../asset/schema/asset.schema';
import response from '../interfaces/response.dto';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Order', schema: OrderSchema },
            { name: 'Asset', schema: AssetSchema },
            { name: 'Payment', schema: PaymentSchema },
            { name: 'User', schema: UserSchema },
        ]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
    ],
    controllers: [PaymentController],
    providers: [PaymentService, response<Payment>],
})
export class PaymentModule {}
