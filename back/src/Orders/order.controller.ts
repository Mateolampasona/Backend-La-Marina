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
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './ordenes.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';

@Controller('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders() {
    try {
      return await this.orderService.getOrders();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Roles(Role.Admin, Role.Guest, Role.User)
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  // @Post('create-order')
  // @HttpCode(HttpStatus.CREATED)
  // async createOrder(@Req() req: any) {
  //   const userId = req.user.userId;
  //   try {
  //     return await this.orderService.createOrder(userId);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Roles(Role.Admin, Role.User, Role.Guest, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/get-order-by-user')
  @HttpCode(HttpStatus.OK)
  async getOrderByUserId(@Req() req: any) {
    const userId = req.user.userId;

    try {
      return await this.orderService.getOrderByUserId(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/get-order/:id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') orderId: string) {
    try {
      return await this.orderService.getOrderById(orderId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.Guest, Role.User)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;

    try {
      return await this.orderService.deleteOrder(id, userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
