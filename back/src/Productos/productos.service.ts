/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor() {}

  //   Servicios
  getProducts() {
    return 'Esta ruta retorna todos los productos';
  }
}
