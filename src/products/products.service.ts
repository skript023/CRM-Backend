import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductsService
{
    constructor(@InjectModel(Product.name) private productModel: mongoose.Model<Product>)
    {}

    async create(product: CreateProductDto, file: Express.Multer.File)
    {
        console.log(file)
        product.file = file?.filename;

        await this.productModel.create(product);

        return {
            message: 'Product added successfully'
        } 
    }

    async findAll()
    {
        return this.productModel.find(null, { createdAt: 0, updatedAt: 0, __v: 0 });
    }

    async findOne(id: string)
    {
        return this.productModel.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
    }

    async update(id: string, product: UpdateProductDto, file: Express.Multer.File)
    {
        if (file != null)
        {
            product.file = file.filename;
        }

        await this.productModel.findByIdAndUpdate(id, product, {
            new: true, runValidators: true
        });

        return {
            message: `Product updated successfully`
        }
    }

    async remove(id: string)
    {
        const product = await this.productModel.findByIdAndDelete(id);

        return {
            message: `${product.name} deleted successfully`
        }
    }
}
