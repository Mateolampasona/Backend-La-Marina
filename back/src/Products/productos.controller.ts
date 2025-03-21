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
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ProductService } from './productos.service';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from './entity/productos.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { ChatGateway } from 'src/gateway/chat.gateway';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  getProducts() {
    try {
      return this.productService.getProducts();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({
    status: 200,
    description: 'Return product by id',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id') id: number) {
    try {
      return this.productService.getProductById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Modify product by id' })
  @ApiResponse({ status: 200, description: 'Product modified', type: Product })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async modifyProduct(
    @Param('id') id: number,
    @Body() updateData: UpdateProductDto,
  ) {
    try {
      const updatedProduct = await this.productService.modifyProduct(
        id,
        updateData,
      );
      this.chatGateway.server.emit('stockUpdate', updatedProduct.productId);
      return updatedProduct;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiResponse({ status: 200, description: 'Product deleted', type: String })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id') id: number) {
    try {
      return this.productService.deleteProduct(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created', type: Product })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    try {
      const userId = req.user.userId;
      console.log('createProductDto', createProductDto);

      const imageUrl = await this.cloudinaryService.uploadImage(file);

      const product = {
        ...createProductDto,
        imageUrl,
      };

      const productCreated = await this.productService.createProduct(
        product,
        userId,
      );

      return productCreated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post(':id/update-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload image' })
  @ApiResponse({ status: 201, description: 'Image uploaded', type: String })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.CREATED)
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      if (!file) {
        throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
      }
      const imageUrl = await this.cloudinaryService.uploadImage(file);

      const updatedData: UpdateProductDto = { imageUrl };
      const updatedProduct = await this.productService.modifyProduct(
        id,
        updatedData,
      );
      return { message: 'Image uploaded', updatedProduct };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/discount')
  @HttpCode(HttpStatus.OK)
  async addDiscount(
    @Param('id') productId: number,
    @Body('discount') discount: any,
  ) {
    try {
      const product = this.productService.addDiscount(productId, discount);
      this.chatGateway.server.emit(
        'discountProduct',
        (await product).productId,
      );
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
