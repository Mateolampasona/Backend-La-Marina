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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCategory() {
    try {
      return this.categoriesService.getCategory();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCategoryById(@Param('id') categoryId: number) {
    try {
      return this.categoriesService.getCategoryById(categoryId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoriesService.createCategory(createCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  deleteCategory(@Param('id') categoryId: number) {
    try {
      return this.categoriesService.deleteCategory(categoryId);
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
      return this.categoriesService.modifyCategory(
        categoryId,
        createCategoryDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
