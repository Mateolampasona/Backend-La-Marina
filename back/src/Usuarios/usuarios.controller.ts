/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './usuarios.services';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Rutas

  // Retornar usuarios
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }
}
