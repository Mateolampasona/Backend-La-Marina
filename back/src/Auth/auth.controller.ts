/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/IniciarSesion.dto';
import { CreateUserDto } from './dto/CrearUsuario.dto';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rutas

  // Iniciar sesión
  @Post('signIn')
  signIn(@Body() credential: SignInAuthDto) {
    return this.authService.signIn(credential);
  }

  // Registrar usuario
  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }
}
