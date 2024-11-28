import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product name',
    description: 'The name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Product description',
    description: 'The description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 100,
    description: 'The price of the product',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The stock of the product',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    example: 1,
    description: 'The category id of the product',
  })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({
    example: true,
    description: 'The status of the product',
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({
    example: 'https://www.image.com/image.jpg',
    description: 'The image url of the product',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
