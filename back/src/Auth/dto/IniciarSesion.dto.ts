/* eslint-disable prettier/prettier */
import { IsEmail, IsString, Matches } from 'class-validator';

export class SignInAuthDto {
  @IsEmail()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos una minúscula, una mayúscula, un numero y un carácter especial',
  })
  @IsString()
  password: string;
}
