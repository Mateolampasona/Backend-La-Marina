/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './productos.controller';
import { ProductService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entitie/productos.entity';
import { Categoria } from 'src/Categorias/entitie/categorias.entitie';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria])],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductosModule {}
