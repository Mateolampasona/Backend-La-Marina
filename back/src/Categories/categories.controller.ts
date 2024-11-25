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
} from '@nestjs/common';
import { CategoriasService } from './categories.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCategory() {
    try {
      return this.categoriasService.getCategory();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCategoryById(@Param('id') categoryId: number) {
    try {
      return this.categoriasService.getCategoryById(categoryId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoriasService.createCategory(createCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  deleteCategory(@Param('id') categoryId: number) {
    try {
      return this.categoriasService.deleteCategory(categoryId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  ModifyCategory(
    @Param('id') categoryId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    try {
      return this.categoriasService.modifyCategory(
        categoryId,
        createCategoryDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
