/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // Rutas
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategorias() {
    const categorias = await this.categoriasService.getCategorias();
    return categorias;
  }
}
