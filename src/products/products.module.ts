import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
