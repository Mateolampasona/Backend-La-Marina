/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductosModule } from './Productos/productos.module';
import { UsuariosModule } from './Usuarios/usuarios.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [ProductosModule, UsuariosModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
