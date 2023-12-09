import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    readonly user_id: string;
    @IsNotEmpty()
    readonly cart_id: string[];
    status: string;
    order_date: string;
}
