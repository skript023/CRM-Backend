import { Module, NotAcceptableException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import * as fs from 'fs';
import * as path from 'path';   

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: __dirname + '/assets/binaries',
                filename: (req, file, callback) => {
                    const name = file.originalname.split('.')[0];
                    const extension = file.originalname.split('.')[1];
                    const filename = `${name}_${Date.now()}.${extension}`;

                    callback(null, filename)
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(dll|bin|vpack)$/))
                {
                    return callback(null, false);
                }

                if (fs.existsSync(path.join(`${__dirname}/assets/binaries`, file.originalname)))
                {
                    const exception = new NotAcceptableException(`File ${file.originalname} is already uploaded!`, `File ${file.originalname} is already uploaded!`);
                    callback(exception, false);
                }

                callback(null, true)
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
