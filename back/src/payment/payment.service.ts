import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/Users/users.services';
import { OrderService } from 'src/Orders/ordenes.service';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { ProductService } from 'src/Products/productos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Compras } from 'src/Compras/entity/compras.entity';
import { Repository } from 'typeorm';
import { sendPurchaseMail } from 'src/Config/nodeMailer';
import { PurchaseDetail } from 'src/Compras/entity/purchaseDetail.entity';
import { Order } from 'src/Orders/entity/order.entity';
import { ChatGateway } from 'src/gateway/chat.gateway';

dotenvConfig({ path: '.env' });
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

@Injectable()
export class PaymentService {
  constructor(
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    @InjectRepository(Compras)
    private readonly comprasRepository: Repository<Compras>,
    @InjectRepository(PurchaseDetail)
    private readonly purchaseDetailRepository: Repository<PurchaseDetail>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async createPreference(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const order = await this.orderService.getOrderByUserId(user.userId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.user.userId !== user.userId) {
      throw new NotFoundException('Order does not belong to user');
    }

    const name = user.name;
    const total = order.totalOrder;
    if (isNaN(total)) {
      throw new NotFoundException('Total is not a number');
    }

    const preference = new Preference(client);

    try {
      const response = await preference.create({
        body: {
          items: [
            {
              id: order.orderId,
              title: 'Orden de compra',
              unit_price: total,
              quantity: 1,
              // picture_url: 'Logo La Marina',
            },
          ],
          marketplace_fee: 0,
          payer: {
            name: user.name,
            email: user.email,
          },
          back_urls: {
            success: `${process.env.FRONT_URL}/payment/success/${order.orderId}`,
            failure: `${process.env.FRONT_URL}/payment/failure/${order.orderId}`,
            pending: `${process.env.FRONT_URL}/payment/pending/${order.orderId}`,
          },
          notification_url: `${process.env.FRONT_URL}/payment/notification`,
          expires: false,
          auto_return: 'all',
          binary_mode: true,
          statement_descriptor: 'La Marina',
        },
      });
      console.log(response.id);

      return response.id;
    } catch (error) {
      console.log('error', error);
      throw new Error('Error creating preference');
    }
  }

  async getPaymentStatus(paymentId: string) {
    const preference = new Preference(client);
    const response = await preference.get({ preferenceId: paymentId });
    return response;
  }

  async handlePaymentSuccess(
    collectionStatus: boolean,
    paymentId: string,
    status: boolean,
    id: string,
    preference_Id: string,
  ) {
    const preference = new Preference(client);
    const response = await preference.get({ preferenceId: preference_Id });

    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (collectionStatus == false) {
      throw new NotFoundException('Payment failed');
    }
    if (status == false) {
      throw new NotFoundException('Payment failed');
    }
    if (!paymentId) {
      throw new NotFoundException('Payment ID not found');
    }

    // Obtener la cantidad actualizada de entradas disponibles
    const updatedInventoryCount = await this.getUpdatedInventoryCount(
      order.orderId,
    );

    const user = await this.userService.getUserByEmail(response.payer.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const email = user.email;
    const name = user.name;
    const date = new Date();
    const total = order.totalOrder;
    try {
      // Creamos la compra
      const compra = await this.comprasRepository.create({
        user: user,
        status: 'Pendiente',
        paymentMethod: 'Mercado Pago',
        payment_preference_id: preference_Id,
        total: order.totalOrder,
        purchaseDate: new Date(
          new Date().toLocaleString('en-US', {
            timeZone: 'America/Argentina/Buenos_Aires',
          }),
        ),
      });
      // Guaradamos la compra
      await this.comprasRepository.save(compra);

      // Creamos los detalles de compra
      for (const orderDetail of order.orderDetails) {
        const purchaseDetail = this.purchaseDetailRepository.create({
          compra: compra,
          product: orderDetail.product,
          quantity: orderDetail.quantity,
          subtotal: orderDetail.product.price,
        });
        // guardamos el detalle de compra
        await this.purchaseDetailRepository.save(purchaseDetail);
      }
      // Vaciamos el carrito del usuario
      order.orderDetails = [];
      order.totalOrder = 0;
      await this.orderRepository.save(order);

      console.log('Enviando email');
      await sendPurchaseMail(email, name, date, total);
      console.log('Email enviado');
    } catch (error) {
      console.error('Error saving pedido:', error);
      throw new HttpException(
        'Failed to save pedido',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.chatGateway.server.emit('updateDashboard', user.userId);
    this.chatGateway.server.emit('adminDashboardUpdate');
    return { message: 'Payment successful' };
  }

  async getUpdatedInventoryCount(orderId: string) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    for (const orderDetails of order.orderDetails) {
      const product = await this.productService.getProductById(
        orderDetails.product.productId,
      );
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      product.stock -= orderDetails.quantity;
      await this.productService.modifyProduct(product.productId, {
        stock: product.stock,
      });
      this.chatGateway.server.emit('stockUpdate', product.productId);
    }
  }
}
