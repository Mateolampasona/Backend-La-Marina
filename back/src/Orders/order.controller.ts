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
} from '@nestjs/common';
import { OrderService } from './ordenes.service';
import { CreateOrderDto } from './dto/createOrder.dto';

@Controller('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders() {
    try {
      return await this.orderService.getOrders();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string) {
    try {
      return await this.orderService.getOrderById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('id') id: string) {
    try {
      return await this.orderService.deleteOrder(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() order: CreateOrderDto) {
    try {
      return await this.orderService.createOrder(order);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
