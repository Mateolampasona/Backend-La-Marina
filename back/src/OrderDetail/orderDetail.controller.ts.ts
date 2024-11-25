/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { OrderDetailsService } from './orderDetail.service.ts';

@Controller('orderDetails')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}
}
