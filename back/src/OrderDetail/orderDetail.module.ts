
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Orders/entity/order.entity';
import { OrderDetailsController } from './orderDetail.controller.ts';
import { OrderDetailsService } from './orderDetail.service.ts';
import { ProductsModule } from 'src/Products/productos.module';
import { OrderDetail } from './entity/orderDetail.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail]), ProductsModule],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [TypeOrmModule],
})
export class OrderDetailModule {}