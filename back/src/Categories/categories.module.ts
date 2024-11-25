/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriasController } from './categories.controller';
import { CategoriasService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Products/entity/productos.entity';
import { Category } from './entity/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],

  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriesModule {}
