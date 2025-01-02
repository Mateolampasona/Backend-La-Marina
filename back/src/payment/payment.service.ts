import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { UsersService } from 'src/Users/users.services';
import { OrderService } from 'src/Orders/ordenes.service';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { ProductService } from 'src/Products/productos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Compras } from 'src/Compras/entity/compras.entity';
import { Repository } from 'typeorm';
import { sendPurchaseMail } from 'src/Config/nodeMailer';

dotenvConfig({ path: '.env' });
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

@Injectable(

)
export class PaymentService {
  
  constructor(
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    @InjectRepository(Compras) private readonly comprasRepository: Repository<Compras>
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
            success: `${process.env.FRONT_URL}/payment/success/${order.id}`,
            failure: `${process.env.FRONT_URL}/payment/failure/${order.id}`,
            pending: `${process.env.FRONT_URL}/payment/pending/${order.id}`,
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

  async handlePaymentSuccess(collectionStatus: boolean, paymentId: string, status: boolean, id: string, preference_Id: string) {
    const preference = new Preference(client);
    const response = await preference.get({ preferenceId: preference_Id });

    const order = await this.orderService.getOrderById(id);
    if(!order) {
      throw new NotFoundException('Order not found');
    }
    if(collectionStatus == false){
      throw new NotFoundException('Payment failed');
    }
    if(status == false) {
      throw new NotFoundException('Payment failed');
    }
    if(!paymentId)  {
      throw new NotFoundException('Payment ID not found');
    }

    // Obtener la cantidad actualizada de entradas disponibles
    const updatedInventoryCount = await this.getUpdatedInventoryCount(order.id);
    // Transmitir la actualizaciion de la cantidad de entradas disponibles
    // this.monitorInventarioGateway.broadcastInventoryUpdate(
    //   Number(order.id),
    //   updatedInventoryCount,
    // );

    const user = await this.userService.getUserByEmail(response.payer.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const email = user.email;
    const name = user.name;
    const date = new Date();
    const total = order.totalOrder;
    try {
      const compra = await this.comprasRepository.create({
        order:order,
        user: user,
        status:"Pendiente",
        paymentMethod:"Mercado Pago",
        payment_preference_id:preference_Id
      })
      await this.comprasRepository.save(compra)
      console.log("Enviando email");
      await sendPurchaseMail(email, name, date, total);
      console.log("Email enviado");
      
      
    }
    catch (error) {
      console.error('Error saving pedido:', error);
      throw new HttpException(
        'Failed to save pedido',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
  }
  
  async getUpdatedInventoryCount(orderId: string) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    for(const orderDetails of order.orderDetails) {
      const product = await this.productService.getProductById(orderDetails.product.id);
      if(!product) {
        throw new NotFoundException('Product not found');
      }
      product.stock -= orderDetails.quantity;
      await this.productService.modifyProduct(product.id, {stock: product.stock});
    }

  }
}
