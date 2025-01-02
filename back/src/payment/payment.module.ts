import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UsersModule } from 'src/Users/users.module';
import { OrderModule } from 'src/Orders/ordenes.module';
import { Order } from 'src/Orders/entity/order.entity';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { ProductsModule } from 'src/Products/productos.module';
import { Compras } from 'src/Compras/entity/compras.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Compras]),
    UsersModule,
    OrderModule,
    ProductsModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}