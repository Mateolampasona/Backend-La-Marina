import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AssignPasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'NewPassword123.',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos una minúscula, una mayúscula, un numero y un carácter especial',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'NewPassword123.',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos una minúscula, una mayúscula, un numero y un carácter especial',
  })
  @IsString()
  confirmPassword: string;
}
