import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/Orders/entity/order.entity';
import { Repository } from 'typeorm';
import { AddProductDto } from './dto/addProduct.dto';
import { ProductService } from '../Products/productos.service';
import { OrderDetail } from './entity/orderDetail.entity';
import { log } from 'node:console';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly productService: ProductService,
  ) {}

  async addProduct(orderId: string, orderDetail: AddProductDto) {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['orderDetails', 'orderDetails.product'] });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    const product = await this.productService.getProductById(orderDetail.productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    if(product.stock < orderDetail.quantity){
      throw new BadRequestException('Stock not available');
    }

    let detail = order.orderDetails.find(detail => detail.product.id === product.id);

    if (detail) {
      detail.quantity = orderDetail.quantity;
      await this.orderDetailRepository.save(detail);
    } else {
      detail = this.orderDetailRepository.create({
        product: product,
        order: order,
        quantity: orderDetail.quantity,
      });
      await this.orderDetailRepository.save(detail);
    }

    
    const totalOrder = await this.calculateTotal(orderId);
    const calculate = await this.orderRepository.update(orderId, { totalOrder: totalOrder });
    const orderUpdated = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['orderDetails', 'orderDetails.product'] });
    const transformedOrderDetails = await orderUpdated.orderDetails.map(detail => ({
      id: detail.id,
      quantity: detail.quantity,
      // total: totalOrder,
      product: {
        id: detail.product.id,
        name: detail.product.name,
        price: detail.product.price,
        stock: detail.product.stock,
      }
    }));

    return {
      ...orderUpdated,
      orderDetails: transformedOrderDetails,
    };
  }

  async calculateTotal(orderId: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['orderDetails', 'orderDetails.product'] });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const total = order.orderDetails.reduce((acc, detail) => {
      return acc + (detail.product.price * detail.quantity);
    }, 0);

    return total;
    
  }


}