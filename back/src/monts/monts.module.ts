import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mont } from './entity/mont.entity';
import { MontController } from './monts.controller';
import { MontService } from './monts.service';
import { UsersService } from 'src/Users/users.services';
import { OrderService } from 'src/Orders/ordenes.service';
import { ComprasService } from 'src/Compras/compras.service';
import { UsersModule } from 'src/Users/users.module';
import { ProductService } from 'src/Products/productos.service';
import { ProductsModule } from 'src/Products/productos.module';
import { Product } from 'src/Products/entity/productos.entity';
import { OrderModule } from 'src/Orders/ordenes.module';
import { Order } from 'src/Orders/entity/order.entity';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { Compras } from 'src/Compras/entity/compras.entity';
import { Category } from 'src/Categories/entity/categories.entity';
import { Discount } from 'src/discounts/entity/discount.entity';
import { Address } from 'src/addresses/entity/addresses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mont,
      Product,
      Order,
      OrderDetail,
      Compras,
      Category,
      Discount,
      Address,
    ]),
    UsersModule,
    ProductsModule,
    OrderModule,
  ],
  controllers: [MontController],
  providers: [
    MontService,
    UsersService,
    OrderService,
    ComprasService,
    ProductService,
  ],
  exports: [MontService],
})
export class MontsModule {}
