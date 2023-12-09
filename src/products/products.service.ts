import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import * as mongoose from 'mongoose';

import * as fs from 'fs';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private productModel: mongoose.Model<Product>,
    ) {}

    async create(product: CreateProductDto, file: Express.Multer.File) {
        if (!file)
            throw new BadRequestException('File is empty, please add file!');

        product.file = file?.filename;

        await this.productModel.create(product);

        return {
            message: 'Product added successfully',
            success: true,
        };
    }

    async findAll() {
        return this.productModel.find(null, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
    }

    async findOne(id: string) {
        return this.productModel.findById(id, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
    }

    async update(
        id: string,
        product: UpdateProductDto,
        file: Express.Multer.File,
    ) {
        if (file != null) {
            product.file = file.filename;
        }

        await this.productModel.findByIdAndUpdate(id, product, {
            new: true,
            runValidators: true,
        });

        return {
            message: `Product updated successfully`,
            success: true,
        };
    }

    async remove(id: string) {
        const product = await this.productModel.findByIdAndDelete(id);

        if (!product)
            throw new NotFoundException('Unable to delete non-existed user');

        const path = `${__dirname}/assets/binaries/${product.name}`;

        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }

        return {
            message: `${product.name} deleted successfully`,
            success: true,
        };
    }
}
