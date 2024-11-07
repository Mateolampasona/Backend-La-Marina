/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductosModule } from './Productos/productos.module';
import { UsuariosModule } from './Usuarios/usuarios.module';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './config/data-source';
import { SeedsModule } from './seeds/seeds.module';
import { CategoriasModule } from './Categorias/categorias.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    SeedsModule,
    ProductosModule,
    CategoriasModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
