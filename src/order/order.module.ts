import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { AssetSchema } from 'src/asset/schema/asset.schema';
import { PaymentSchema } from 'src/payment/schema/payment.schema';
import { UserSchema } from '../users/schema/user.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Order', schema: OrderSchema }, 
			{ name: 'Asset', schema: AssetSchema },
			{ name: 'Payment', schema: PaymentSchema },
			{ name: 'User', schema: UserSchema }
		]),
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
