import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { AssetSchema } from 'src/asset/schema/asset.schema';
import { PaymentSchema } from 'src/payment/schema/payment.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Order', schema: OrderSchema }, 
			{ name: 'Asset', schema: AssetSchema },
			{ name: 'Payment', schema: PaymentSchema}
		])
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
