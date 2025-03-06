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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './ordenes.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { get } from 'http';
import { ChatGateway } from 'src/gateway/chat.gateway';
import { DiscountCodeDto } from 'src/discounts/dto/createDiscount.dto';
import { UpdateOrderShipmentDto } from './dto/createOrder.dto';

@Controller('Orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly chatGateway: ChatGateway,
  ) {}

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
  @Get('total-orders')
  @HttpCode(HttpStatus.OK)
  async getTotalOrders() {
    try {
      return await this.orderService.getTotalOrders();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('last-order')
  @HttpCode(HttpStatus.OK)
  async getLastOrder() {
    try {
      return await this.orderService.getLastOrder();
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
      this.chatGateway.server.emit('adminDashboardUpdate');
      return await this.orderService.deleteOrder(id, userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('apply-discount/:orderId')
  @HttpCode(HttpStatus.ACCEPTED)
  async putDiscount(
    @Param('orderId') orderId: string,
    @Body() discountCode: DiscountCodeDto,
  ) {
    try {
      return await this.orderService.putDiscount(orderId, discountCode);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/shipment')
  async updateOrderShipment(
    @Param('id') id: string,
    @Body() updateOrderShipmentDto: UpdateOrderShipmentDto,
  ) {
    try {
      return await this.orderService.updateOrderShipment(
        id,
        updateOrderShipmentDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
