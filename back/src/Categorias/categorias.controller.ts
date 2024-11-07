/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // Rutas
  @Get()
  @HttpCode(HttpStatus.OK)
  getCategory() {
    const categories = this.categoriasService.getCategory();
    return categories;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCategoryById(@Param('id') id: string) {
    const category = this.categoriasService.getCategoryById(id);
    return category;
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriasService.createCategory(createCategoryDto);
  }
}
