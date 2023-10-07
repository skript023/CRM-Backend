import { IsNotEmpty } from "class-validator"

export class CreatePaymentDto
{
    @IsNotEmpty()
    readonly user_id: string

    @IsNotEmpty()
    readonly product_id: string

    @IsNotEmpty()
    readonly order_id: string

    @IsNotEmpty()
    readonly amount: number

    readonly status: string
}
