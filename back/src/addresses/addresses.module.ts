import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Users/entity/user.entity';
import { Address } from './entity/addresses.entity';
import { Discount } from 'src/discounts/entity/discount.entity';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { Order } from 'src/Orders/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Discount, User, Address]),
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
