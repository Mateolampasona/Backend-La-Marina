import { ApiProperty } from '@nestjs/swagger';
import { OrderDetail } from '../../OrderDetail/entity/orderDetail.entity';
import { User } from 'src/Users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id de la orden',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'Usuario que realizó la orden',
    type: () => User,
  })
  user: User;

  @OneToOne(() => OrderDetail, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_detail_id' })
  @ApiProperty({
    description: 'Detalle de la orden',
    type: () => OrderDetail,
  })
  orderDetail: OrderDetail;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  @ApiProperty({
    description: 'Fecha de creación de la orden',
    example: '2021-10-10T00:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  @ApiProperty({
    description: 'Fecha de actualización de la orden',
    example: '2021-10-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
