/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './productos.service';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    try {
      return this.productService.getProducts();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id') id: number) {
    try {
      return this.productService.getProductById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  modifyProduct(@Param('id') id: number, @Body() updateData: UpdateProductDto) {
    try {
      return this.productService.modifyProduct(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id') id: number) {
    try {
      return this.productService.deleteProduct(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body('data') body: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      console.log(body);

      const imageUrl = await this.cloudinaryService.uploadImage(file);

      const product: CreateProductDto = {
        ...body,
        imageUrl,
      };

      const productCreated = await this.productService.createProduct(product);

      return { message: 'Producto creado exitosamente', productCreated };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
