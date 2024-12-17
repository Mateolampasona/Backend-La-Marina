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
    return orders
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findOne({ where: { id: id }, relations: ['orderDetails', 'orderDetails.product'] });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order  
  }

  async deleteOrder(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    await this.orderRepository.delete(id);
    return { message: `Order with ID ${id} sucesfully deleted` };
  }

  async createOrder(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newOrder = await this.orderRepository.create({ user });
    await this.orderRepository.save(newOrder);
    return {
      id: newOrder.id,
      total: newOrder.totalOrder,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
      },
      orderdetails: [],
    };
  }

  async addProduct(orderId: string, orderDetail: any) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    orderDetail.order = order;
    const newOrderDetail = await this.orderDetailRepository.create(orderDetail);
    await this.orderDetailRepository.save(newOrderDetail);
    return newOrderDetail;
  }
}
