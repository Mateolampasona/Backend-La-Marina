/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/Productos/entitie/productos.entity';
import { Categoria } from './entitie/categorias.entitie';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],

  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
