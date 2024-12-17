import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create_preference')
  async createPReference(@Body() data: PaymentDto) {
    const preferenceId = await this.paymentService.createPreference(data);
    return { preferenceId };
  }

  @Get('status/:pref_id')
  async getPaymentStatus(@Param('pref_id') prefId: string) {
    const status = await this.paymentService.getPaymentStatus(prefId);
    return status;
  }

  @Post('notification')
  async handleNotification(@Body() notificationData: any) {
    console.log('Notification data: ', notificationData);
    return { received: true };
  }
}
