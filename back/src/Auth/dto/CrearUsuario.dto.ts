import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  // Mail
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // name
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  nombre: string;

  //   Contraseña
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos una minúscula, una mayúscula, un numero y un carácter especial',
  })
  @IsString()
  @IsNotEmpty()
  contraseña: string;

  //   Confirmar Contraseña
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos una minúscula, una mayúscula, un numero y un carácter especial',
  })
  @IsString()
  @IsNotEmpty()
  confirmarContraseña: string;
}
