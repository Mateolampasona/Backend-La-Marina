import { IsNotEmpty, IsString } from "class-validator";

export class DeleteOrderDetailDto {
    @IsNotEmpty()
    @IsString()
    detailId: string
}