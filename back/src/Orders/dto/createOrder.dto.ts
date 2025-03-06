import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Id del usuario que realizó la orden',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class UpdateOrderShipmentDto {
  @IsBoolean()
  IsShipment: boolean;

  @IsOptional()
  @IsNumber()
  addressId?: number;
}
