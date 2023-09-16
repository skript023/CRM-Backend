import { IsNotEmpty } from "class-validator"
import { ProductGrade } from "../../products/enum/product.enum"

export class CreateAssetDto
{
    @IsNotEmpty()
    user_id: string
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    grade: ProductGrade
}
