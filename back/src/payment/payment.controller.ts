import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { RoleGuard } from 'src/Auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ChatGateway } from 'src/gateway/chat.gateway';
import {
  EfectivePaymentDto,
  UpdateEffectivePaymentDto,
} from './dto/effectivePayment.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly chatGatewat: ChatGateway,
  ) {}

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create_preference')
  async createPreference(
    @Body() data: PaymentDto,
  ): Promise<{ preferenceId: string }> {
    console.log('Data:', data);
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

  @Post('success')
  async handleSuccess(
    @Body('collection_status') collectionStatus: boolean,
    @Body('payment_id') paymentId: string,
    @Body('status') status: boolean,
    @Body('preference_id') preferenceId: string,
    @Body('id') id: string,
  ) {
    console.log('Collection Status:', collectionStatus);
    console.log('Payment ID:', paymentId);
    console.log('Status:', status);
    console.log('ID:', id);
    try {
      const payment = await this.paymentService.handlePaymentSuccess(
        collectionStatus,
        paymentId,
        status,
        id,
        preferenceId,
      );
      return payment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('failure')
  async handlePaymentFailure() {
    try {
      return 'Ocurrio un error al realizar el pago';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('effective')
  async handleEffectivePayment(@Body() data: EfectivePaymentDto) {
    try {
      const payment = await this.paymentService.handleEffectivePayment(data);
      return payment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('effective/:purchaseId')
  async updateEffectivePayment(
    @Param('purchaseId') purchaseId: UpdateEffectivePaymentDto,
  ) {
    try {
      const payment =
        await this.paymentService.updateEffectivePayment(purchaseId);
      return payment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
