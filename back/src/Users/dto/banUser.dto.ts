import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BanUserDto {
  @ApiProperty({
    type: String,
    description: 'The reason for the ban',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  banreason: string;

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean()
  permanent: boolean = true;
}
