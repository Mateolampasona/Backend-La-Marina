/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './usuarios.controller';
import { UsersService } from './usuarios.services';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsuariosModule {}
