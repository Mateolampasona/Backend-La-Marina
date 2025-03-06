import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Provinces } from '../entity/addresses.entity';

export class CreateAddresDto {
  @ApiProperty({
    description: 'Calle',
    type: String,
    example: 'Santa fe Este ',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Numeracion',
    type: Number,
    example: 123,
  })
  @IsNumber()
  number: number;

  @ApiProperty({
    description: 'Ciudad',
    type: String,
    example: 'San Juan',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Departamento',
    type: String,
    example: 'Capital',
  })
  @IsEnum(Provinces)
  state: Provinces;

  @ApiProperty({
    description: 'Pais',
    type: String,
    example: 'Argentina',
  })
  @IsString()
  country: string = 'Argentina';

  @ApiProperty({
    description: 'Codigo Postal',
    type: String,
    example: '5400',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'Comentarios',
    type: String,
    example: 'Casa de rejas negras',
  })
  @IsString()
  comments: string;
}
