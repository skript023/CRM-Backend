import { ProductGrade } from "../enum/product.enum"

export class CreateProductDto
{
    readonly code: number
    readonly name: string
    readonly grade: ProductGrade
    readonly game: string
    readonly target: string
    readonly file: string
    readonly version: string
    readonly status: string
}
