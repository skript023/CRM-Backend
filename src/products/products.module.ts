import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: __dirname + '/assets/binaries',
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const extension = file.originalname.split('.')[1];
                    const filename = `${name}_${Date.now()}.${extension}`

                    cb(null, filename)
                }
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(dll|bin|vpack)$/)) {
                    return cb(null, false)
                }

                cb(null, true)
            }
        }),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
