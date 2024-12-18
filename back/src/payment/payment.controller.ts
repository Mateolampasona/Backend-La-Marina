import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { RoleGuard } from 'src/Auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create_preference')
  async createPReference(
    @Body() data: PaymentDto,
  ): Promise<{ preferenceId: string }> {
    const preferenceId = await this.paymentService.createPreference(data);
    return { preferenceId };
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
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
