import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import * as mongoose from 'mongoose';

import * as fs from 'fs';
import response from '../interfaces/response.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private productModel: mongoose.Model<Product>,
        private response: response<Product>
    ) {}

    async create(product: CreateProductDto, file: Express.Multer.File) {
        if (!file)
            throw new BadRequestException('File is empty, please add file!');

        product.file = file?.filename;

        const result = await this.productModel.create(product);

        if (!result) throw new InternalServerErrorException('Failed create product');

        this.response.message = `Success create product ${result.name}`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll() {
        const products = await this.productModel.find(null, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });

        this.response.message = 'Success retrive products';
        this.response.success = true;
        this.response.data = products;

        return this.response.json();
    }

    async findOne(id: string) {
        const product = await this.productModel.findById(id, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });

        if (!product) throw new NotFoundException('Product not found');

        this.response.message = 'Success retrive product';
        this.response.success = true;
        this.response.data = product;

        return this.response.json();
    }

    async update(
        id: string,
        product: UpdateProductDto,
        file: Express.Multer.File,
    ) {
        if (file != null) {
            product.file = file.filename;
        }

        const result = await this.productModel.findByIdAndUpdate(id, product, {
            new: true,
            runValidators: true,
        });

        if (!result) throw new NotFoundException('Unable to update non-existing data');

        this.response.message = `Success update product ${result.name}`;
        this.response.success = true;

        return this.response.json();
    }

    async remove(id: string) {
        const result = await this.productModel.findByIdAndDelete(id);

        if (!result)
            throw new NotFoundException('Unable to delete non-existed data');

        const path = `${__dirname}/assets/binaries/${result.name}`;

        if (fs.existsSync(path))
        {
            fs.unlinkSync(path);
        }

        this.response.message = `Success delete product ${result.name}`;
        this.response.success = true;

        return this.response.json();
    }
}
