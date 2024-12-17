/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './productos.controller';
import { ProductService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/productos.entity';
import { Category } from 'src/Categories/entity/categories.entity';
import { CloudinaryConfig } from 'src/Config/cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductService, CloudinaryConfig, CloudinaryService],
  exports: [ProductService], // Export ProductService here
})
export class ProductsModule {}