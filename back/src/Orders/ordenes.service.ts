/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';

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
}
