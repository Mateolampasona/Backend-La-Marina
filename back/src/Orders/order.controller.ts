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
  @Post(':userId/create-order')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Param('userId') userId: number) {
    try {
      console.log('hol');

      return await this.orderService.createOrder(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':orderId/addProduct')
  @HttpCode(HttpStatus.CREATED)
  async addOrderDetail(
    @Param('orderId') orderId: string,
    @Body() orderDetail: any,
  ) {
    try {
      return await this.orderService.addProduct(orderId, orderDetail);
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
}
