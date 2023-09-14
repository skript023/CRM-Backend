import { IsNotEmpty } from "class-validator";
import { Exclude } from "class-transformer";

export class UpdatePasswordDto
{
    @IsNotEmpty()
    @Exclude()
    password: string
}