/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderDetailsService } from './orderDetail.service.ts';
import { AddProductDto } from './dto/addProduct.dto.js';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { RoleGuard } from 'src/Auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('orderDetails')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Roles(Role.Admin, Role.Guest, Role.User)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/addProduct')
  @HttpCode(HttpStatus.CREATED)
  async addOrderDetail(@Body() orderDetail: AddProductDto, @Req() req: any) {
    const userId = req.user.userId;
    try {
      return await this.orderDetailsService.addProduct(orderDetail, userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Roles(Role.Admin, Role.Guest, Role.User)
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('/delete')
  @HttpCode(HttpStatus.OK)
  async deleteOrderDetail(@Body('detailId') detailId: string) {
    try {
      return await this.orderDetailsService.deleteOrderDetail(detailId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
