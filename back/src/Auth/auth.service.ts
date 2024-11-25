import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInAuthDto } from './dto/IniciarSesion.dto';
import { CreateUserDto } from './dto/CrearUsuario.dto';
import { UsersService } from 'src/Users/users.services';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  // Servicios

  // Iniciar sesión
  async signIn(credential: SignInAuthDto) {
    // const dbUser = await this.userService.findOneByEmail(credential.email);
    // if (!dbUser) {
    //   throw new NotFoundException('Usuario no encontrado');
    // }
    // const isPasswordValid = await bcrypt.compare(
    //   credential.password,
    //   dbUser.password,
    // );
    // if (!isPasswordValid) {
    //   throw new BadRequestException('Contraseña invalida');
    // }
    // return { success: 'Usuario logueado correctamente' };
  }

  // Registrar usuario
  signUp(user: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
}
