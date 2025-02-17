/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { UsersService } from 'src/Users/users.services';
import { Between, Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { Discount } from 'src/discounts/entity/discount.entity';
import { DiscountCodeDto } from 'src/discounts/dto/createDiscount.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly userService: UsersService,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async getOrders() {
    const orders = await this.orderRepository.find({
      relations: ['orderDetails', 'user', 'orderDetails.product', 'discount'],
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
      where: { orderId },
      relations: ['orderDetails', 'orderDetails.product', 'user', 'discount'],
    });

    return order;
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['orderDetails', 'orderDetails.product', 'user', 'discount'],
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  async deleteOrder(id: string, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
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
    return totalOrders;
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

  async getOrdersByMont(montIndex: number, year: number): Promise<Order[]> {
    const startDate = new Date(year, montIndex, 1);
    const endDate = new Date(year, montIndex + 1, 0); // Último día del mes

    console.log('startDate', startDate);
    console.log('endDate', endDate);

    const orders = await this.orderRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
    if (!orders || orders.length === 0) {
      throw new BadRequestException('No users found');
    }
    return orders;
  }

  async putDiscount(orderId: string, discountCode: DiscountCodeDto) {
    // Revisamos que exista la orden
    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['orderDetails', 'orderDetails.product', 'user', 'discount'],
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    // Revisamos que el código de descuento no esté vacío
    if (!discountCode.discountCode || discountCode.discountCode.length === 0) {
      throw new HttpException(
        'Discount code is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Revisamos si la orden ya tiene un descuento aplicado y es diferente al nuevo descuento
    if (
      order.discount &&
      order.discount.discountCode !== discountCode.discountCode
    ) {
      // Restaurar el total original de la orden
      order.totalOrder = order.originalTotal;
      order.discount = null;
      order.discountAmmount = 0;
    }

    // Revisamos que el descuento exista y sus usos no hayan llegado al máximo
    const discount = await this.discountRepository.findOne({
      where: { discountCode: discountCode.discountCode },
    });
    if (!discount) {
      throw new HttpException('Discount not found', HttpStatus.NOT_FOUND);
    }
    if (discount.uses >= discount.maxUses) {
      throw new HttpException('Discount code expired', HttpStatus.BAD_REQUEST);
    }

    if (discount.discountType === 'percentage') {
      const total = order.totalOrder;
      const discountAmmount = Math.round(
        total * (discount.discountValue / 100),
      );
      const totalWithDiscount = total - discountAmmount;
      order.discount = discount;
      order.totalOrder = totalWithDiscount;
      order.discountAmmount = discountAmmount;
      order.originalTotal = total;

      discount.uses = discount.uses + 1;
      discount.orders = [];
      discount.orders.push(order);
      await this.discountRepository.save(discount);
      await this.orderRepository.save(order);
      const updatedOrder = await this.orderRepository.findOne({
        where: { orderId },
        relations: ['orderDetails', 'orderDetails.product', 'user', 'discount'],
      });

      const response = {
        message: 'Discount applied',
        updatedOrder: {
          ...updatedOrder,
          discount: {
            discountCode: discount.discountCode,
            percentage: discount.discountValue,
            uses: discount.uses,
            maxUses: discount.maxUses,
          },
        },
      };

      return response;
    }
    if (discount.discountType === 'fixed') {
      if (order.totalOrder < 10000) {
        throw new HttpException(
          'El total de la orden debe superar los $10.000',
          HttpStatus.BAD_REQUEST,
        );
      }
      const total = order.totalOrder;
      const totalWithDiscount = total - discount.discountValue;
      order.discount = discount;
      order.totalOrder = totalWithDiscount;
      order.discountAmmount = discount.discountValue;
      order.originalTotal = total;

      discount.uses = discount.uses + 1;
      discount.orders = [];
      discount.orders.push(order);
      await this.discountRepository.save(discount);
      await this.orderRepository.save(order);
      const updatedOrder = await this.orderRepository.findOne({
        where: { orderId },
        relations: ['orderDetails', 'orderDetails.product', 'user', 'discount'],
      });

      const response = {
        message: 'Discount applied',
        updatedOrder: {
          ...updatedOrder,
          discount: {
            discountCode: discount.discountCode,
            fixed: discount.discountValue,
            uses: discount.uses,
            maxUses: discount.maxUses,
          },
        },
      };

      return response;
    }
  }
}
