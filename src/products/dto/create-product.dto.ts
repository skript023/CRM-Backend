import { IsNotEmpty } from 'class-validator';
import { ProductGrade } from '../enum/product.enum';

export class CreateProductDto {
    @IsNotEmpty()
    readonly code: number;
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly grade: ProductGrade;
    @IsNotEmpty()
    readonly game: string;
    @IsNotEmpty()
    readonly target: string;
    file: string;
    readonly version: string;
    readonly status: string;
}
