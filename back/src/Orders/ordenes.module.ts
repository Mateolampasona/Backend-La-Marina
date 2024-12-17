/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { Order } from './entity/order.entity';
import { OrderService } from './ordenes.service';
import { OrderController } from './order.controller';
import { UsersModule } from 'src/Users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail]), UsersModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
