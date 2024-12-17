import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Id del usuario que realizó la orden',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
