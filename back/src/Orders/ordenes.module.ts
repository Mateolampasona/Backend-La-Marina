/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { Order } from './entity/order.entity';
import { OrderService } from './ordenes.service';
import { OrderController } from './order.controller';
import { UsersModule } from 'src/Users/users.module';
import { ChatGateway } from 'src/gateway/chat.gateway';
import { Discount } from 'src/discounts/entity/discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Discount]),
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, ChatGateway],
  exports: [OrderService],
})
export class OrderModule {}
