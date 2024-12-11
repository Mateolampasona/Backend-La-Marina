import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/Auth/enum/roles.enum';

export class ModifyUserDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    description: 'The name of the user',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos una minúscula, una mayúscula, un numero y un carácter especial',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiHideProperty()
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
