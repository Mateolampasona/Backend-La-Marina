import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Orders/entity/order.entity';
import { OrderDetailsController } from './orderDetail.controller.ts';
import { OrderDetailsService } from './orderDetail.service.ts';
import { ProductsModule } from 'src/Products/productos.module';
import { OrderDetail } from './entity/orderDetail.entity';
import { UsersModule } from 'src/Users/users.module';
import { UsersService } from 'src/Users/users.services';
import { User } from 'src/Users/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, User]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, UsersService],
  exports: [TypeOrmModule],
})
export class OrderDetailModule {}
