import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddProductDto {
  @ApiProperty({
    type: Number,
    description: 'The id of the product',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    type: Number,
    description: 'The quantity of the product',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
