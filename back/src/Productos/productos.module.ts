/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './productos.controller';
import { ProductService } from './productos.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductosModule {}
