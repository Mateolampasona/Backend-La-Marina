/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';

@Controller('Ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  // Rutas
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrdenes() {
    const ordenes = await this.ordenesService.getOrdenes();
    return ordenes;
  }
}
