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

    create(createProductDto: CreateProductDto)
    {
        return this.productModel.create(createProductDto);
    }

    findAll()
    {
        return this.productModel.find(null, { createdAt: 0, updatedAt: 0, __v: 0 });
    }

    findOne(id: string)
    {
        return this.productModel.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
    }

    update(id: string, updateProductDto: UpdateProductDto)
    {
        return this.productModel.findByIdAndUpdate(id, updateProductDto, {
            new: true, runValidators: true
        });
    }

    remove(id: string)
    {
        return this.productModel.findByIdAndDelete(id);
    }
}
