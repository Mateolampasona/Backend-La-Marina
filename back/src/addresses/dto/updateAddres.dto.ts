import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Provinces } from '../entity/addresses.entity';

export class UpdateAddresDto {
  @ApiProperty({
    description: 'Calle',
    type: String,
    example: 'Santa fe Este ',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Numeracion',
    type: Number,
    example: 123,
  })
  @IsNumber()
  @IsOptional()
  number?: number;

  @ApiProperty({
    description: 'Ciudad',
    type: String,
    example: 'San Juan',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Departamento',
    type: String,
    example: 'Capital',
  })
  @IsEnum(Provinces)
  @IsOptional()
  state: Provinces;

  @ApiProperty({
    description: 'Pais',
    type: String,
    example: 'Argentina',
  })
  @IsString()
  @IsOptional()
  country?: string = 'Argentina';

  @ApiProperty({
    description: 'Codigo Postal',
    type: String,
    example: '5400',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Comentarios',
    type: String,
    example: 'Casa de rejas negras',
  })
  @IsString()
  @IsOptional()
  comments?: string;
}
