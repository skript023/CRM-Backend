import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Auth({
        role: ['admin', 'staff'],
        access: 'create',
    })
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 20000000 })],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.productsService.create(createProductDto, file);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'update',
    })
    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 20000000 })],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.productsService.update(id, updateProductDto, file);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
