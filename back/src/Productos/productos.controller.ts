/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './productos.service';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  //   Rutas
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    const products = await this.productService.getProducts();
    return products;
  }
}
