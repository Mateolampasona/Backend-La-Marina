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
  })
  @IsString()
  @IsNotEmpty()
  banreason?: string = 'Fuiste baneado por incmoplimiento de las normas';

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean()
  permanent?: boolean = true;
}
