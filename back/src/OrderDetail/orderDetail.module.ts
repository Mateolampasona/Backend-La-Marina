/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrderDetailsController } from './orderDetail.controller.ts.js';
import { OrderDetailsService } from './orderDetail.service.ts.js';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
})
export class OrderDetailModule {}
