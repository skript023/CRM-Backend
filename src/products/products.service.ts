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

    async create(createProductDto: CreateProductDto)
    {
        this.productModel.create(createProductDto);

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

    async update(id: string, updateProductDto: UpdateProductDto)
    {
        const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, {
            new: true, runValidators: true
        });

        return {
            message: `${product.name} updated successfully`
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
