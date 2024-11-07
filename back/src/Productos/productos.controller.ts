/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './productos.service';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  //   Rutas

  // Retornar todos los productos
  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.productService.getProducts();
  }

  // Retornar productos por su ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  // Modificar producto
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  modifyProduct(@Param('id') id: string, @Body() updateData: UpdateProductDto) {
    return this.productService.modifyProduct(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }
}
