import { IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly user_id: string;
    @IsNotEmpty()
    readonly start_date: string;
    @IsNotEmpty()
    readonly end_date: string;
    @IsNotEmpty()
    readonly status: string;
}
