import { ApiProcessingResponse, ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/Orders/entity/order.entity';
import { Product } from 'src/Products/entity/productos.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orderDetail' })
export class OrderDetail {
  @ApiProperty({
    type: 'number',
    description: 'Id de la orden',
  })
  @PrimaryGeneratedColumn()
  id: number;

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
  @ApiProperty({
    description: 'Orden',
  })
  order: Order;

  @ManyToMany(() => Product)
  @JoinTable()
  @ApiProperty({
    description: 'Productos',
  })
  products: Product[];
}
