import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    type: String,
    example: 'Producto',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    type: String,
    example: 'Descripción del producto',
    nullable: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    type: Number,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Stock del producto',
    type: Number,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Estado del producto',
    type: Boolean,
    nullable: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description: 'Imagen del producto',
    type: String,
    nullable: false,
  })
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    description: 'ID de la categoría',
    type: Number,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}
