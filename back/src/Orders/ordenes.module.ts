/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './ordenes.service';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrdenesModule {}
