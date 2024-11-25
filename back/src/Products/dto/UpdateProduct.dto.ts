import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    type: String,
    example: 'Producto',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    type: String,
    example: 'Descripción del producto',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Precio del producto',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Stock del producto',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Estado del producto',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Imagen del producto',
    type: String,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
