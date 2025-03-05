import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EfectivePaymentDto {
  @ApiProperty({
    type: String,
    description: 'The order id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

export class UpdateEffectivePaymentDto {
  @ApiProperty({
    type: String,
    description: 'The purchase id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  purchaseId: string;

  @ApiProperty({
    type: String,
    description: 'The payment status',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  shippingStatus: string;

  @ApiProperty({
    type: String,
    description: 'The shipping status',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  paymentStatus: string;
}
