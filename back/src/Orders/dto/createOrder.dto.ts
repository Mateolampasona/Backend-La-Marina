import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Id del usuario que realizó la orden',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID del detalle de la orden',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  orderDetailId: string;
}
