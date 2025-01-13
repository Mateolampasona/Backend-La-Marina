import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/Orders/entity/order.entity';
import { Compras } from 'src/Compras/entity/compras.entity';
import { Role } from 'src/Auth/enum/roles.enum';

export class UserResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  isBanned: boolean;

  @ApiProperty({ type: () => Order })
  order: Order;

  @ApiProperty({ type: () => [Compras] })
  compras: Compras[];
}