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
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Id de la orden',
    example: 1,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @ApiProperty({
    description: 'Usuario que realizó la orden',
    type: () => User,
  })
  user: User;

  @OneToOne(() => OrderDetail, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
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
