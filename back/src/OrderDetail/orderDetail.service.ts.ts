import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/Orders/entity/order.entity';
import { Repository } from 'typeorm';
import { AddProductDto } from './dto/addProduct.dto';
import { ProductService } from '../Products/productos.service';
import { OrderDetail } from './entity/orderDetail.entity';
import { log } from 'node:console';
import { UsersService } from 'src/Users/users.services';
import { DeleteOrderDetailDto } from './dto/deleteOrderDetail.dto';
import { ChatGateway } from 'src/gateway/chat.gateway';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async addProduct(orderDetail: AddProductDto, userId: number): Promise<Order> {
    const user = await this.userService.getOneUser(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let order;
    if (user.order === null) {
      // En caso de que el usuario no tenga una orden crearemos una
      const orderCreated = this.orderRepository.create({
        user: user,
        createdAt: new Date(
          new Date().toLocaleString('en-US', {
            timeZone: 'America/Argentina/Buenos_Aires',
          }),
        ),
      });
      await this.orderRepository.save(orderCreated);

      order = await this.orderRepository.findOne({
        where: { orderId: orderCreated.orderId },
        relations: ['orderDetails', 'orderDetails.product'],
      });
      this.chatGateway.server.emit('adminDashboardUpdate');
    } else {
      const orderId = user.order.orderId;

      order = await this.orderRepository.findOne({
        where: { orderId },
        relations: ['orderDetails', 'orderDetails.product', 'user'],
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
      (detail) => detail.product.productId === orderDetail.productId,
    );

    if (existingOrderDetail) {
      // Update the quantity of the existing order detail
      existingOrderDetail.quantity = orderDetail.quantity;
      if (orderDetail.quantity === 0) {
        await this.orderDetailRepository.delete(
          existingOrderDetail.orderDetailId,
        );
      }
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
    const updatedOrder = await this.orderRepository.findOne({
      where: { orderId: order.orderId },
      relations: ['orderDetails', 'orderDetails.product', 'user'],
    });

    // Calculate the total order amount
    const totalOrder = await this.calculateTotal(order.orderId);
    updatedOrder.totalOrder = totalOrder;
    await this.orderRepository.save(updatedOrder);

    return updatedOrder;
  }

  async calculateTotal(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { orderId: orderId },
      relations: ['orderDetails', 'orderDetails.product'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const total = order.orderDetails.reduce((acc, detail) => {
      return acc + detail.product.price * detail.quantity;
    }, 0);

    console.log('CalculateTotal', total);
    return total;
  }

  async deleteOrderDetail(
    deleteOrderDetailDto: DeleteOrderDetailDto,
  ): Promise<Order> {
    const detailId = deleteOrderDetailDto.detailId;
    const detail = await this.orderDetailRepository.findOne({
      where: { orderDetailId: detailId },
      relations: ['order'],
    });

    if (!detail) {
      throw new BadRequestException('Order detail not found');
    }
    const order = detail.order;

    await this.orderDetailRepository.delete(detailId);

    const orderDetails = await this.orderDetailRepository.find({
      where: { order: order },
    });

    const total = await this.calculateTotal(order.orderId);

    order.totalOrder = total;
    await this.orderRepository.save(order);

    return order;
  }
}
