/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { OrderDetailsService } from './orderDetail.service.ts';
import { AddProductDto } from './dto/addProduct.dto.js';

@Controller('orderDetails')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post(':orderId/addProduct')
  @HttpCode(HttpStatus.CREATED)
  async addOrderDetail(
    @Param('orderId') orderId: string,
    @Body() orderDetail: AddProductDto,
  ) {
    try {
      return await this.orderDetailsService.addProduct(orderId, orderDetail);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
