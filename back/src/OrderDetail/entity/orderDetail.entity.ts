import { ApiProcessingResponse, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Order } from 'src/Orders/entity/order.entity';
import { Product } from 'src/Products/entity/productos.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orderDetail' })
export class OrderDetail {
  @ApiProperty({
    description: 'ID del detalle de orden que realiza la orden',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Column({
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  @ApiProperty({
    type: 'number',
    description: 'Precio de la orden',
    required: true,
  })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn({ name: 'order_id' })
  @ApiProperty({
    description: 'ID de la Orden',
  })
  order: Order;

  @ManyToMany(() => Product)
  @JoinTable()
  @ApiProperty({
    description: 'Array de productos de la orden',
  })
  products: Product[];
}
