/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { UsersService } from 'src/Users/users.services';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';

@Injectable()
export class OrderService {
  
  
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly userService: UsersService,
  ) {}

  async getOrders() {
    const orders = await this.orderRepository.find({
      relations: ['orderDetails', 'user', 'orderDetails.product'],
    });
    if (!orders) {
      throw new HttpException('No orders found', HttpStatus.NOT_FOUND);
    }
    return orders;
  }

  async getOrderByUserId(userId: number) {
    const user = await this.userService.getOneUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.order === null) {
      throw new HttpException('User without orders', HttpStatus.NOT_FOUND);
    }
    const orderId = user.order.orderId;
    const order = await this.orderRepository.findOne({
      where: {  orderId },
      relations: ['orderDetails', 'orderDetails.product', 'user'],
    });

    return order;
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['orderDetails', 'orderDetails.product', 'user'],
    });
    if(!order){
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  async deleteOrder(id: string, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { orderId:id },
      relations: ['user'],
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userService.getOneUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.role !== 'admin') {
      if (order.user.userId != user.userId) {
        throw new HttpException(
          'You are not allowed to delete this order',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    await this.orderDetailRepository.delete({ order: order });
    await this.orderRepository.delete(id);
    return { message: `Order with ID ${id} sucesfully deleted` };
  }

async getTotalOrders() {
  const totalOrders = await this.orderRepository.count();
  if(!totalOrders){
    throw new HttpException('No orders found', HttpStatus.NOT_FOUND);
  }
  return totalOrders
}

async getLastOrder() {
  const [lastOrder] = await this.orderRepository.find({
    order: { createdAt: 'DESC' },
    take: 1,
  });
  if (!lastOrder) {
    throw new HttpException('No orders found', HttpStatus.NOT_FOUND);
  }
  return lastOrder;
}
}
