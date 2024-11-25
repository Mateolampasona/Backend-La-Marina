/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './ordenes.service';

@Controller('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Rutas
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders() {
    try {
      return await this.orderService.getOrders();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
