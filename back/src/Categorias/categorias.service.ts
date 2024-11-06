/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriasService {
  constructor() {}

  // Servicios
  getCategorias() {
    return 'Esta ruta retorna todas las categorias';
  }
}
