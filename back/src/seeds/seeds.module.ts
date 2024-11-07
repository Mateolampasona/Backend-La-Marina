import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from 'src/Categorias/entitie/categorias.entitie';
import { Producto } from 'src/Productos/entitie/productos.entity';
import { CategoriesSeed } from './categories/categories.seed';
import { ProductSeed } from './products/products.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Producto])],
  providers: [CategoriesSeed, ProductSeed],
  exports: [CategoriesSeed, ProductSeed],
})
export class SeedsModule {}
