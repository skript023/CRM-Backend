import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('products')
export class ProductsController
{
    constructor(private readonly productsService: ProductsService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'create'
    })
    @Post('add')
    create(@Body() createProductDto: CreateProductDto)
    {
        return this.productsService.create(createProductDto);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get()
    findAll()
    {
        return this.productsService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read'
    })
    @Get('detail/:id')
    findOne(@Param('id') id: string)
    {
        return this.productsService.findOne(id);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'update'
    })
    @Patch('update/:id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto)
    {
        return this.productsService.update(id, updateProductDto);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'delete'
    })
    @Delete('delete/:id')
    remove(@Param('id') id: string)
    {
        return this.productsService.remove(id);
    }
}
