import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentDto {
    @ApiProperty({
        description: 'Order ID',
        example: '123456'
    })
    @IsString()
    @IsNotEmpty()
    orderId:string

    @ApiProperty({
        type: String,
        description: 'The email of the user',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      email: string;

      

}