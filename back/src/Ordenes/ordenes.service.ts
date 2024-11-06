/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdenesService {
  constructor() {}

  // Servicios

  getOrdenes() {
    return 'Esta ruta retorna todas las ordenes';
  }
}
