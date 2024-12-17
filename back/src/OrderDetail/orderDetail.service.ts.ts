import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/Orders/entity/order.entity';
import { Repository } from 'typeorm';
import { AddProductDto } from './dto/addProduct.dto';
import { ProductService } from '../Products/productos.service';
import { OrderDetail } from './entity/orderDetail.entity';
import { log } from 'node:console';
import { UsersService } from 'src/Users/users.services';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
  ) {}

  async addProduct(orderDetail: AddProductDto, userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let order;
    if (user.order === null) {
      // En caso de que el usuario no tenga una orden crearemos una
      const orderCreated = this.orderRepository.create({
        user: user,
      });
      await this.orderRepository.save(orderCreated);

      order = await this.orderRepository.findOne({
        where: { id: orderCreated.id },
        relations: ['orderDetails', 'orderDetails.product'],
      });
    } else {
      const orderId = user.order.id;

      order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['orderDetails', 'orderDetails.product'],
      });
      if (!order) {
        throw new BadRequestException('Order not found');
      }
    }

    const product = await this.productService.getProductById(
      orderDetail.productId,
    );
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if the product already exists in the order
    const existingOrderDetail = order.orderDetails.find(
      (detail) => detail.product.id === orderDetail.productId,
    );

    if (existingOrderDetail) {
      // Update the quantity of the existing order detail
      existingOrderDetail.quantity += orderDetail.quantity;
      await this.orderDetailRepository.save(existingOrderDetail);
    } else {
      // Create a new order detail
      const orderDetailCreated = this.orderDetailRepository.create({
        order: order,
        product: product,
        quantity: orderDetail.quantity,
      });
      await this.orderDetailRepository.save(orderDetailCreated);
    }

    // Refetch the order with the updated order details
    order = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['orderDetails', 'orderDetails.product'],
    });

    // Calculate the total order amount
    const totalOrder = await this.calculateTotal(order.id);
    order.totalOrder = totalOrder;
    await this.orderRepository.save(order);

    return order;
  }

  async calculateTotal(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails', 'orderDetails.product'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const total = order.orderDetails.reduce((acc, detail) => {
      return acc + detail.product.price * detail.quantity;
    }, 0);

    return total;
  }
}
