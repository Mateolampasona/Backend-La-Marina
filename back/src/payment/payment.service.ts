import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { UsersService } from 'src/Users/users.services';
import { OrderService } from 'src/Orders/ordenes.service';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

@Injectable()
export class PaymentService {
  constructor(
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
  ) {}

  async createPreference(data: PaymentDto) {
    const { email, orderId } = data;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const order = await this.orderService.getOrderById(orderId);
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
              id: order.id,
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
            success: `http://localhost:3001/success/${order.id}`,
            failure: `http://localhost:3001/failure/${order.id}`,
            pending: `http://localhost:3001/pending/${order.id}`,
          },
          notification_url: 'http://localhost:3000/payment/notification',
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
}
