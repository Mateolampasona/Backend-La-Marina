import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
