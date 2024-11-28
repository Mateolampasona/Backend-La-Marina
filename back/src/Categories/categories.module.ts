/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Products/entity/productos.entity';
import { Category } from './entity/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],

  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
