/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getOrders() {
    const orders = await this.orderRepository.find();
    if (!orders) {
      throw new HttpException('No orders found', HttpStatus.NOT_FOUND);
    }
    return orders;
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async deleteOrder(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    await this.orderRepository.delete(id);
    return { message: `Order with ID ${id} sucesfully deleted` };
  }

  async createOrder(order: CreateOrderDto) {
    // const newOrder = await this.orderRepository.create(order);
    // await this.orderRepository.save(newOrder);
    // return newOrder;
  }
}
