import { IsNotEmpty } from "class-validator"

export class CreatePaymentDto
{
    @IsNotEmpty()
    readonly product_id: string
    @IsNotEmpty()
    readonly amount: string
    @IsNotEmpty()
    readonly status: string
}
