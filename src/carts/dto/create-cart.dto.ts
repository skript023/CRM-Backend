import { IsNotEmpty } from "class-validator"

export class CreateCartDto
{
    @IsNotEmpty()
    product_id: string
    @IsNotEmpty()
    user_id: string
    @IsNotEmpty()
    quantity: number
    cart_date: string
}
